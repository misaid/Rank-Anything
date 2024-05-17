// async function checkAuth() {
//     try {
//         const response = await fetch('https://msaid.dev/api/verifyjwt', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         });

//         // If code 200 that means verifcation sucesful
//         if (response.ok) {
//             const result = await response.json();
//             console.log('verified')
//             return result.decoded;
//         } else {
//             console.error('Failed to verify JWT token:', response.statusText);
//             return false;
//         }
//     } catch (error) {
//         console.error("Error verifity JWT token", error);
//         return false
//     }
// }
// export default checkAuth;
