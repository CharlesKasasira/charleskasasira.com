---
title: "Deploying a Simple HTML Page Using a Self-hosted GitLab Runner"
description: "Push to GitLab → automatically deploy index.html on your own machine. This article walks through setting up GitLab CI/CD with a self-hosted runner to…"
date: "2025-12-22T16:04:53.268Z"
updated: "2025-12-22T16:04:53.268Z"
cover: ""
originalUrl: "https://blog.charleskasasira.com/deploying-a-simple-html-page-using-a-self-hosted-gitlab-runner"
---

> Push to GitLab → automatically deploy `index.html` on your own machine.

This article walks through setting up **GitLab CI/CD with a self-hosted runner** to deploy a simple **single-page HTML website**. No Docker. No Kubernetes. Just Git, SSH, and GitLab Runner.

### Step 1: Create a Simple HTML page and create `.gitlab-ci.yml`

This is the only time we will need the IDE, just a simple `index.html` and `.gitlab-ci.yml`. Add the project to GitLab.

```xml
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

```yaml
stages:
  - deploy

deploy_local:
  stage: deploy
  tags: [local]
  only:
    - main
  script:
    - echo "Deploying on local machine"
    - cd /var/www/html/myapp
    - git pull origin main
```

### Step 2: Install GitLab Runner on Your Server

On the machine where deployment should happen:

```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash

sudo apt install gitlab-runner

gitlab-runner --version
```

### Step 3: Register the Runner

In your GitLab project:

* **Settings → CI/CD → Runners**
    
* Copy the **registration token**
    

On the server:

```bash
sudo gitlab-runner register
```

Use:

* GitLab URL: [`https://gitlab.com`](https://gitlab.com)
    
* Executor: **shell**
    
* Tags: `local`
    
* Run untagged jobs: **false**
    

Confirm:

```bash
sudo gitlab-runner list
```

If jobs stay **Pending**, this step was missed or done without `sudo`.

### Step 4: Prepare the Web Directory

Create the deployment directory and give ownership to the runner user:

```bash
sudo mkdir -p /var/www/html/myapp
sudo chown -R gitlab-runner:www-data /var/www/html/myapp
sudo chmod -R 775 /var/www/html/myapp
```

### Step 5: Set Up SSH Access for `gitlab-runner`

The runner pulls code using Git, so it needs SSH access.

```bash
sudo -u gitlab-runner -H ssh-keygen -t ed25519 -C "gitlab-runner" # Generate SSH key

sudo -u gitlab-runner -H ssh-keyscan -H gitlab.com >> /home/gitlab-runner/.ssh/known_hosts # Add GitLab to known hosts

sudo cat /home/gitlab-runner/.ssh/id_ed25519.pub # Add the public key to GitLab
```

Add this key in:

* **Project → Settings → Repository → Deploy Keys**
    

(Deploy keys are safer than user keys.)

### Step 6: Clone the Repository as `gitlab-runner`

This step is critical to avoid permission and “dubious ownership” errors.

```bash
sudo -u gitlab-runner -H bash -lc \
'git clone git@gitlab.com:ckasasira/gitlab-runner-test.git /var/www/html/myapp'
```

Verify, You should see `.git/` owned by `gitlab-runner`.

```bash
ls -la /var/www/html/myapp
```

## Step 7: Watch It Deploy

Make any changes to the HTML, commit and push:

```bash
git add .
git commit -m "Add local deployment pipeline"
git push origin main
```

In GitLab:

* Go to **CI/CD → Pipelines**
    
* The job should move from **Pending → Running → Passed**
    

Refresh your browser:

```bash
http://<your-server-ip>/myapp/
```

You should see:

> **Hello World 1**

Change the heading, push again, and watch it update instantly.

---

## Common Errors (and What They Teach You)

* `Job pending`: Runner not registered or tag mismatch.
    
* `Permission denied`: Files owned by `root`, not `gitlab-runner`.
    
* `detected dubious ownership`: Repo created with `sudo git init`.  
    Fix by re-cloning as `gitlab-runner`.
    
* `Permission denied (publickey)`: Missing SSH deploy key.
    

## Final Thoughts

CI/CD doesn’t start with Kubernetes.  
It starts with **one file, one push, one automated deployment**.

Once you understand this flow, everything else (Docker, cloud runners, pipelines) makes sense.

If you’re learning DevOps: **this is the right place to start.**

If you want, I can:

* Rewrite this for [**Dev.to**](http://Dev.to) **/ Medium tone**
    
* Add **architecture diagrams**
    
* Add **rollback support**
