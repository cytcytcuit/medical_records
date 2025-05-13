require('dotenv').config();
const Web3 = require('web3');
const contract = require('@truffle/contract');
const db = require('./db');

// Koneksi ke Anvil (atau jaringan lain)
const web3 = new Web3("http://127.0.0.1:8572");

// Import ABI dan address
const contractJson = require('./build/contracts/MedicalRecords.json');
const MedicalRecords = contract(contractJson);
MedicalRecords.setProvider(web3.currentProvider);

async function main() {
  const instance = await MedicalRecords.deployed();

  console.log("Listening for events...");

  // Event Listener untuk RecordAdded
  instance.RecordAdded({}, (error, event) => {
    if (error) {
      console.error("Error:", error);
      return;
    }

    const { sender, id, patientName, recordData, timestamp } = event.returnValues;

    console.log(`New Record Added: ${id} - ${patientName} - ${recordData} - ${timestamp}`);

    // Insert data ke MySQL
    const sql = "INSERT INTO records (sender_address, patient_name, record_data, timestamp) VALUES (?, ?, ?, FROM_UNIXTIME(?))";
    db.query(sql, [sender, patientName, recordData, timestamp], (err) => {
      if (err) {
        console.error("Error inserting data to MySQL:", err);
      } else {
        console.log("Data successfully saved to MySQL.");
      }
    });
  });
}

main();
