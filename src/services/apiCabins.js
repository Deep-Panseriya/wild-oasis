import supabase, { supabaseUrl } from './supabase'

export async function getCabins () {
  const { data, error } = await supabase.from('cabins').select('*')

  if (error) {
    //console.error(error)
    throw new Error('Cabins could not be loaded')
  }

  return data
}

// export async function createCabin(newCabin){
//     const { data, error } = await supabase.from('cabins').insert([newCabin])
//     if (error) {
//       console.error(error)
//       throw new Error('Cabins could not be created')
//     }
 // 
//     return data
// }
export async function createEditCabins (newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl)

  const imageName = `${Math.random()} - ${newCabin.image.name}`.replaceAll(
    '/',
    ''
  )

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`

  //ANCHOR - 1. Create/edit a cabin
  let query = supabase.from('cabins')

  //ANCHOR - Add a data
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }])

  //ANCHOR - Edit data
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id)

  const { data, error } = await query.select().single()

  if (error) {
    throw new Error('Cabins could not be deleted')
  }

  //ANCHOR - 2.UPLOAD IMAGE
  if (hasImagePath) return data
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image)

  //ANCHOR -  3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id)
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
    )
  }
  return data
}
export async function deleteCabins (id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id)
  if (error) {
    console.error(error)
    throw new Error('Cabins could not be deleted')
  }

  return data
}


