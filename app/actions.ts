"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const forename = formData.get("forename")?.toString();
  const role = formData.get("role")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !name || !forename || !role) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "All fields are required",
    );
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    console.error("Auth error:", authError.code + " " + authError.message);
    return encodedRedirect("error", "/sign-up", authError.message);
  } 

  // If auth was successful, create a new user in public.users table
  if (authData.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        auth_user_id: authData.user.id,
        email: email,
        name: `${forename} ${name}`,
        role: role
      }]);

    if (insertError) {
      console.error("Error creating user record:", insertError);
      return encodedRedirect("error", "/sign-up", "Could not create user profile");
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Check your email for a confirmation link",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const createNote = async (formData: FormData) => {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!title) {
    throw new Error("Title is required");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title,
      content,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return redirect("/protected/notes");
};

export const updateNote = async (formData: FormData) => {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!id || !title) {
    throw new Error("ID and title are required");
  }

  const { data, error } = await supabase
    .from("notes")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return redirect("/protected/notes");
};

export const deleteNote = async (formData: FormData) => {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!id) {
    throw new Error("ID is required");
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message || 'Failed to delete note');
  }

  return redirect("/protected/notes");
};
