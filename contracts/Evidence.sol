// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Evidence {
    struct EvidenceData {
        string caseId;
        string hash;
        string evidenceType;
        string description;
        string date;
        address walletAddress;
    }

    mapping(string => EvidenceData) private evidences;

    event EvidenceCreated(
        string caseId,
        string hash,
        string evidenceType,
        string description,
        string date,
        address walletAddress
    );

    function createEvidence(
        string memory _caseId,
        string memory _hash,
        string memory _evidenceType,
        string memory _description,
        string memory _date,
        address _walletAddress
    ) public {

        evidences[_caseId] = EvidenceData({
            caseId: _caseId,
            hash: _hash,
            evidenceType: _evidenceType,
            description: _description,
            date: _date,
            walletAddress: _walletAddress
        });

        emit EvidenceCreated(_caseId, _hash, _evidenceType, _description, _date, _walletAddress);
    }

    function getEvidence(string memory _caseId) public view returns (
        string memory caseId,
        string memory hash,
        string memory evidenceType,
        string memory description,
        string memory date,
        address walletAddress
    ) {
        require(bytes(evidences[_caseId].hash).length > 0, "Evidence not found");

        EvidenceData memory e = evidences[_caseId];
        return (e.caseId, e.hash, e.evidenceType, e.description, e.date, e.walletAddress);
    }
}
