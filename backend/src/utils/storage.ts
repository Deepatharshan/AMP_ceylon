import { createClient } from './supabase/client'

export async function uploadImages(files: File[], bucket: string): Promise<string[]> {
  const supabase = createClient()
  const urls: string[] = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error } = await supabase.storage.from(bucket).upload(filePath, file)

    if (error) {
      console.error('Upload error:', error)
      throw new Error(`Failed to upload ${file.name}: ${error.message}`)
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    urls.push(data.publicUrl)
  }

  return urls
}
