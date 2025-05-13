// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    struct Record {
        address sender;
        string patientName;
        string recordData;
        uint256 timestamp;
    }

    Record[] public records;

    // Event untuk mencatat rekam medis yang baru
    event RecordAdded(address indexed sender, uint256 id, string patientName, string recordData, uint256 timestamp);

    // Fungsi untuk menambah rekam medis
    function addRecord(string memory _patientName, string memory _recordData) public {
        uint256 id = records.length;
        records.push(Record(msg.sender, _patientName, _recordData, block.timestamp));
        emit RecordAdded(msg.sender, id, _patientName, _recordData, block.timestamp);
    }
}

