import supabase, { supabaseUrl } from './supabase'

export async function signUp ({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: ''
      }
    }
  })

  if (error) throw new Error(error.message)

  return data
}

export async function login ({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw new Error(error.message)
  // Check if the user is logged in
  return { data, error }
}

export async function getCurrentUser () {
  const { data: session } = await supabase.auth.getSession()
  if (!session) return null
  const { data, error } = await supabase.auth.getUser()
  //console.log('Current user:', data)
  if (error) throw new Error('Error logging in:', error)
  return data?.user || null
}

export async function logout () {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Error logging out:', error)
  return null
}

export async function updateCurrentUser ({ password, fullName, avatar }) {

  //1.Updata data
  let updataData
  if (password) updataData = { password }
  if (fullName) updataData = { data: { fullName } }

  const { data, error } = await supabase.auth.updateUser(updataData)
  if (error) throw new Error(error.message);
  if (!avatar) return data; 

  //2. Upload Image avatar
  const fileName = `avatar-${data.user?.id}-${Math.random()}`
  const { error: storageError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar)
  if (storageError) throw new Error(storageError.message)

  //3.Updata Avatar
  const {data: updateUser , error: error2} = await supabase.auth.
  updateUser({
    data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    }
  })
  if (error2) throw new Error(error2.message)
    return updateUser
}
