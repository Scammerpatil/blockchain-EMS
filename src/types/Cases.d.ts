import { Evidence } from "./Evidence";
import { PoliceStation } from "./PoliceStation";

export interface Case {
  _id: string;
  policeStation: PoliceStation;
  caseId: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  evidence: Evidence[];
  description: string;
  date: string;
}
