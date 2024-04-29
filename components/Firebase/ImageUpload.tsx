import { useContext } from "react";
import { api } from "../../services/api";
import { storage } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";






interface ImageUploadProps {
    nameFile: String,
    file: any,
    nome: FormDataEntryValue,
    curso: FormDataEntryValue,
    email: FormDataEntryValue,
    text: FormDataEntryValue
}

export async function ImageUpload({nameFile, file, text, nome, curso, email}: ImageUploadProps){

    let imageUrl;
    const storageRef = ref(storage, `images/egressos/${nameFile}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
        'state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  async () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...

    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log(typeof downloadURL, 'File available at', downloadURL );
      imageUrl = String(downloadURL)
      
      try {

          api.post('/egressos/create', {
          nome: nome,
          curso: curso,
          email: email,
          imageUrl: downloadURL,
          text: text
        })

        api.post('/egressos/nodemailer', {
          nome: nome,
          curso: curso,
          email: email,
          imageUrl: downloadURL,
          text: text
        })
        console.log('ESSA É A IMAGEM URL: ', imageUrl)

        alert('Mensagem enviada!')
      } catch(err){
        console.log(err, 'Erro com a validação do formulário')

      }
    });
  }
);
console.log('IMAGE URL DENTRO DO IMAGEUPLOAD', imageUrl)


}