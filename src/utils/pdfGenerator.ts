import { jsPDF } from 'jspdf';
import { InterviewSession } from '../types';

export const generateInterviewPdfReport = (session: InterviewSession, candidateName: string = 'Candidate') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 40;

  // Header Banner Background
  doc.setFillColor(30, 27, 75); // Dark Indigo #1e1b4b
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PrepAI Master', margin, 42);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(199, 210, 254); // indigo-200
  doc.text('Official AI Interview Performance Evaluation Report', margin, 62);

  const dateStr = new Date(session.completedAt || session.createdAt || Date.now()).toLocaleDateString();
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 120, 62);

  y = 115;

  // Candidate & Session Overview Info
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, pageWidth - margin * 2, 60, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`Candidate: ${candidateName}`, margin + 15, y + 25);
  doc.text(`Target Track: ${session.track}`, margin + 15, y + 45);

  doc.text(`Difficulty Level: ${session.difficulty}`, pageWidth / 2 + 20, y + 25);
  doc.text(`Session ID: #${session.id.slice(0, 8)}`, pageWidth / 2 + 20, y + 45);

  y += 80;

  // Score Highlight Box
  const questions = session.questions || [];
  const avgTech =
    questions.length > 0
      ? Math.round(questions.reduce((acc, q) => acc + (q.answer?.technicalScore || 0), 0) / questions.length)
      : 0;
  const avgComm =
    questions.length > 0
      ? Math.round(questions.reduce((acc, q) => acc + (q.answer?.communicationScore || 0), 0) / questions.length)
      : 0;
  const avgSent =
    questions.length > 0
      ? Math.round(questions.reduce((acc, q) => acc + (q.answer?.sentimentScore || 0), 0) / questions.length)
      : 0;

  const score = session.overallScore || Math.round((avgTech + avgComm + avgSent) / 3);
  const hireStatus = score >= 85 ? 'Strong Hire' : score >= 70 ? 'Competitive Candidate' : 'Requires Review';

  // Overall Score Banner
  doc.setFillColor(score >= 80 ? 236 : 243, score >= 80 ? 253 : 244, score >= 80 ? 245 : 246); // emerald-50 or indigo-50
  doc.setDrawColor(score >= 80 ? 167 : 199, score >= 80 ? 243 : 210, score >= 80 ? 208 : 254);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 50, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`Overall Readiness Score: ${score} / 100`, margin + 15, y + 30);

  doc.setFontSize(12);
  doc.setTextColor(score >= 80 ? 5 : 79, score >= 80 ? 150 : 70, score >= 80 ? 105 : 229); // emerald or indigo
  doc.text(`Status: ${hireStatus}`, pageWidth - margin - 170, y + 30);

  y += 65;

  // Category Metrics Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Key Metric Category Breakdown', margin, y);
  y += 15;

  const metrics = [
    { name: 'Technical Accuracy & Depth', score: avgTech },
    { name: 'Communication & Structure', score: avgComm },
    { name: 'Confidence & Spoken Sentiment', score: avgSent },
  ];

  metrics.forEach((m) => {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

    doc.setFont('helvetica', 'medium');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(m.name, margin + 10, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 27, 75);
    doc.text(`${m.score}%`, pageWidth - margin - 50, y + 15);

    y += 26;
  });

  y += 15;

  // Strengths & Weaknesses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Evaluation Highlights', margin, y);
  y += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('• Core Strengths:', margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const strengths = session.strengths || ['Clear architectural reasoning', 'Structured problem-solving framework'];
  strengths.forEach((s) => {
    doc.text(`  - ${s}`, margin + 10, y);
    y += 14;
  });

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11); // amber
  doc.text('• Areas for Refinement:', margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const weaknesses = session.weaknesses || ['Deeper edge case coverage', 'Pacing and deliberate pauses'];
  weaknesses.forEach((w) => {
    doc.text(`  - ${w}`, margin + 10, y);
    y += 14;
  });

  y += 20;

  // Improvement Plan Section
  if (session.improvementPlan) {
    if (y > 650) {
      doc.addPage();
      y = 40;
    }

    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254); // indigo-200
    doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 27, 75); // indigo-950
    doc.text('AI Personal Improvement & Study Plan', margin + 12, y + 18);
    y += 40;

    if (session.improvementPlan.focusAreas && session.improvementPlan.focusAreas.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text('Key Technical Focus Areas:', margin, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      session.improvementPlan.focusAreas.forEach((area) => {
        const splitArea = doc.splitTextToSize(`• ${area}`, pageWidth - margin * 2 - 20);
        doc.text(splitArea, margin + 10, y);
        y += splitArea.length * 12 + 2;
      });
      y += 8;
    }

    if (session.improvementPlan.suggestedPractice && session.improvementPlan.suggestedPractice.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129); // emerald-600
      doc.text('Actionable Practice Drills & Exercises:', margin, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      session.improvementPlan.suggestedPractice.forEach((practice, idx) => {
        const splitPractice = doc.splitTextToSize(`[ Action ${idx + 1} ] ${practice}`, pageWidth - margin * 2 - 20);
        doc.text(splitPractice, margin + 10, y);
        y += splitPractice.length * 12 + 4;
      });
      y += 10;
    }
  }

  // Per Question Summary
  if (y > 680) {
    doc.addPage();
    y = 40;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Questions & AI Feedback Summary', margin, y);
  y += 20;

  questions.forEach((q, i) => {
    if (y > 720) {
      doc.addPage();
      y = 40;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 27, 75);
    doc.text(`Q${i + 1}: ${q.questionText.slice(0, 80)}${q.questionText.length > 80 ? '...' : ''}`, margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const feedback = q.answer?.aiFeedback || 'Answer submitted and evaluated.';
    const splitFeedback = doc.splitTextToSize(`Feedback: ${feedback}`, pageWidth - margin * 2 - 20);
    doc.text(splitFeedback, margin + 10, y);

    y += splitFeedback.length * 12 + 10;
  });

  // Footer Signature
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by PrepAI Master • Autonomous Interview Coaching Engine', margin, doc.internal.pageSize.getHeight() - 20);

  // Save PDF file
  const fileName = `PrepAI_Report_${session.track.replace(/\s+/g, '_')}_${dateStr.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
