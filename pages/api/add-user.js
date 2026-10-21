import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_KADASAFE;
const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY_KADASAFE;

const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req, res) => {
  try {
    const { full_name, phone, email, dob, gender, password, role } = req.body;

    if (!phone) {
      const response = { Status: "Failure", Details: "Phone not provided" };
      return res.status(400).json(response);
    }

    if (!password) {
      const response = { Status: "Failure", Details: "Password not provided" };
      return res.status(400).json(response);
    }


    const { data, error } = await supabase.auth.admin.createUser({
      phone: phone,
      password: password,
      phone_confirm: true,
      user_metadata: { role: "admin" },
    });
    // console.log(req.body);

    console.log(error);
    // console.log(user);
    // if (error) throw error;
    // const { id } = user;

    if (data) {
      const response = await supabase
        .from("profiles")
        .update({
          full_name: full_name,
          role: role,
          phone: phone,
          gender: gender,
          email: email,
          is_admin: true,
          dob: dob,
        })
        .eq("id", data.user.id);
      if (response?.error) {
        console.log(response?.error);
        throw error;
      }

    }
  } catch (error) {
    const response = { Status: "Failure", Details: error };
    return res.status(400).json(response);
  }
  return;
};

export default handler;
