import { useState } from "react"
import axios from "axios"

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzMzYzhhOC00ZWZlLTQ4ZDktODFlYS1jYzY2ZWMxNzAyNTciLCJlbWFpbCI6Imd1aWxsYXVtZXBldG90QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4YjJlMzFhNjM2NDI4NDM1MGZiMSIsInNjb3BlZEtleVNlY3JldCI6IjRhZjhkY2U0NTk2YWUyNmVmN2E2OWU3YzE2ZmQyY2EyMDAyYWE4NDUwYmFjZjIzOWVhNTE4YWM4NDFlODE4YjUiLCJpYXQiOjE2NzkzMzM0NDN9.t3fVBTXZ13oY0Yp0vlCh1IlCHs4PD_nmVGl8l7BdG1o'


const FolderUpload = () => {

    const [selectedFile, setSelectedFile] = useState();

    const changeHandler = (event) => {
        setSelectedFile(event.target.files);
    };

    const handleSubmission = async () => {

        const formData = new FormData();

        Array.from(selectedFile).forEach((file) => {
            formData.append("file", file)
        })

        const metadata = JSON.stringify({
            name: 'Folder name',
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        })
        formData.append('pinataOptions', options);
        console.log(formData._boundary)
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: JWT,
                }
            });
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <label className="form-label">choose Folder</label>
            <input directory="" webkitdirectory="" type="file" onChange={changeHandler} />
            <button onClick={handleSubmission}>Submit</button>
        </>
    )
}

export default FolderUpload