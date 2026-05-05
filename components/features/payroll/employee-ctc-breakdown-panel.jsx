"use client";

import { useMemo, useState } from "react";
import { calculateCtcBreakdown, formatInr, sanitizeAnnualCtc } from "@/lib/payroll-data";

export default function EmployeeCtcBreakdownPanel() {
  const [candidateName, setCandidateName] = useState("");
  const [annualCtcInput, setAnnualCtcInput] = useState("276000");

  const annualCtc = sanitizeAnnualCtc(annualCtcInput);
  const breakdown = useMemo(
    () => calculateCtcBreakdown(annualCtc, candidateName),
    [annualCtc, candidateName]
  );

  return (
    <section className="page-section panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">CTC Calculator</p>
          <h3>Enter annual CTC and calculate the breakup</h3>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Name</span>
          <input
            placeholder="Candidate name"
            value={candidateName}
            onChange={(event) => setCandidateName(event.target.value)}
          />
        </label>
        <label>
          <span>Candidate&apos;s CTC</span>
          <input
            inputMode="numeric"
            placeholder="Enter annual CTC"
            value={annualCtcInput}
            onChange={(event) => setAnnualCtcInput(event.target.value)}
          />
        </label>
      </div>

      <div className="score-grid">
        <div className="score-card">
          <strong>{breakdown.name || "Candidate"}</strong>
          <small>Name</small>
        </div>
        <div className="score-card">
          <strong>{formatInr(breakdown.annualCtc)}</strong>
          <small>Annual CTC</small>
        </div>
        <div className="score-card">
          <strong>{formatInr(breakdown.totalCompensationMonthly)}</strong>
          <small>Monthly CTC</small>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Salary Component</th>
            <th>Monthly</th>
            <th>Yearly</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.sections.flatMap((section) =>
            section.items.map((item, index) => (
              <tr
                className={item.emphasis ? "breakup-total-row" : undefined}
                key={`${section.label}-${item.label}`}
              >
                <td>{index === 0 ? section.label : ""}</td>
                <td>{item.label}</td>
                <td>{formatInr(item.monthly)}</td>
                <td>{formatInr(item.yearly)}</td>
                <td>{item.reason}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <p className="body-copy breakup-note">
        Gross pay is calculated after employer statutory contribution. Display values are rounded
        to match the spreadsheet pattern, so some monthly rows can differ by INR 1 from the totals.
      </p>
    </section>
  );
}
