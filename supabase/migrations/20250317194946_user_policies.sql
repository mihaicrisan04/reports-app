-- Allow users to read their own record
CREATE POLICY "Users can view own record" 
ON public.users
FOR SELECT 
USING (auth.uid()::text = auth_user_id::text);

-- Allow users to update their own record
CREATE POLICY "Users can update own record" 
ON public.users
FOR UPDATE 
USING (auth.uid()::text = auth_user_id::text)
WITH CHECK (auth.uid()::text = auth_user_id::text);

-- Allow users to delete their own record
CREATE POLICY "Users can delete own record"
ON public.users
FOR DELETE
USING (auth.uid()::text = auth_user_id::text);

-- Allow service role to insert new users
CREATE POLICY "Service role can insert users"
ON public.users
FOR INSERT
TO service_role
WITH CHECK (true);