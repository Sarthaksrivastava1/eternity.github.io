const contractAddress = "0x4AE243397985319D1056150873935ea2F20a93A5"; // Replace with your deployed contract address
        const abi = [ // The ABI you provided
            {
                "inputs": [
                    { "internalType": "string", "name": "_data", "type": "string" },
                    { "internalType": "string", "name": "_extraData", "type": "string" }
                ],
                "name": "saveString",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    { "internalType": "uint256", "name": "_id", "type": "uint256" }
                ],
                "name": "getString",
                "outputs": [
                    { "internalType": "string", "name": "", "type": "string" },
                    { "internalType": "string", "name": "", "type": "string" },
                    { "internalType": "uint256", "name": "", "type": "uint256" },
                    { "internalType": "uint256", "name": "", "type": "uint256" }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "nextId",
                "outputs": [
                    { "internalType": "uint256", "name": "", "type": "uint256" }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    { "internalType": "uint256", "name": "", "type": "uint256" }
                ],
                "name": "savedStrings",
                "outputs": [
                    { "internalType": "string", "name": "data", "type": "string" },
                    { "internalType": "string", "name": "extraData", "type": "string" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
                    { "internalType": "uint256", "name": "id", "type": "uint256" }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        let web3;
        let contract;

        // Initialize Web3
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                await ethereum.request({ method: 'eth_requestAccounts' });
                contract = new web3.eth.Contract(abi, contractAddress);
            } else {
                alert('MetaMask not detected. Please install it!');
            }
        });

        // Convert image to Base64
        function imageToBase64(inputElement, callback) {
            const file = inputElement.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                const base64String = event.target.result.split(',')[1]; // Extract Base64 part
                callback(base64String);
            };

            reader.readAsDataURL(file); // Convert image to data URL (Base64)
        }

        // Save image function
        async function saveImage() {
            const imageInput = document.getElementById('imageInput');
            const extraData = document.getElementById('extraData').value;

            imageToBase64(imageInput, async function(base64String) {
                const accounts = await web3.eth.getAccounts();
                const nextId = await contract.methods.nextId().call(); // Fetch the next ID
                await contract.methods.saveString(base64String, extraData).send({ from: accounts[0] });
                alert(`Image saved successfully! Your unique ID is: ${nextId}`);
            });
        }

        // Retrieve image function
        async function getImage() {
            const id = document.getElementById('id').value;
            const result = await contract.methods.getString(id).call();

            const timestamp = Number(result[2]); 
            const date = new Date(timestamp * 1000); 
            const readableDate = date.toLocaleString();

            const imageBase64 = result[0];
            document.getElementById('result').innerText =
                `Maker Name: ${result[1]} || Date/Time: ${readableDate} || ID: ${result[3]}`;
            document.getElementById('outputImage').src = `data:image/jpeg;base64,${imageBase64}`;
        }