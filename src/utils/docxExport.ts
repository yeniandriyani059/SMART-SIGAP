import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { GeneratedRppResult } from '../types/sigap';

/**
 * Menghasilkan file dokumen Word (.docx) asli yang dapat dibuka & diedit di Microsoft Word / Google Docs
 * menggunakan library `docx`.
 */
export async function downloadRppAsDocx(
  rpp: GeneratedRppResult,
  customCp?: string
): Promise<string> {
  const cpText = customCp || rpp.capaianPembelajaran;

  const createInfoRow = (label: string, value: string) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 22 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `: ${value}`, size: 22 })],
            }),
          ],
        }),
      ],
    });

  const doc = new Document({
    creator: 'SMART SIGAP - SD Negeri Karanggintung 06',
    title: `${rpp.formatDokumen} ${rpp.identitas.mataPelajaran} - ${rpp.identitas.topik}`,
    description: 'Dokumen Perangkat Ajar Kurikulum Merdeka [SIMULASI DEMO]',
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: `${rpp.formatDokumen.toUpperCase()} KURIKULUM MERDEKA [SIMULASI DEMO]`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: rpp.identitas.satuanPendidikan.toUpperCase(),
                bold: true,
                size: 24,
              }),
            ],
          }),

          // Tabel Identitas Dokumen
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            },
            rows: [
              createInfoRow('Satuan Pendidikan', rpp.identitas.satuanPendidikan),
              createInfoRow('Bentuk Dokumen', `${rpp.formatDokumen} [DEMO]`),
              createInfoRow('Mata Pelajaran', rpp.identitas.mataPelajaran),
              createInfoRow(
                'Kelas / Fase / Semester',
                `${rpp.identitas.kelas} / ${rpp.identitas.fase} / ${
                  rpp.identitas.semester || 'Ganjil'
                }`
              ),
              createInfoRow('Materi Pokok', rpp.identitas.topik),
              createInfoRow('Alokasi Waktu', rpp.identitas.alokasiWaktu),
              createInfoRow('Model Pembelajaran', rpp.identitas.modelPembelajaran),
              createInfoRow(
                'Pendekatan Pembelajaran',
                rpp.identitas.pendekatanPembelajaran
              ),
              createInfoRow(
                'Metode Pembelajaran',
                rpp.identitas.metodePembelajaran ||
                  'Diskusi Kelompok, Eksperimen, dan Tanya Jawab'
              ),
              createInfoRow('Guru Penyusun', rpp.identitas.penyusun),
            ],
          }),

          new Paragraph({
            spacing: { before: 300, after: 120 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'A. Capaian Pembelajaran & Profil Lulusan',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [new TextRun({ text: cpText, size: 22 })],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Dimensi Profil Lulusan / Pelajar Pancasila: ',
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: rpp.profilPelajarPancasila.join('; '),
                size: 22,
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 200, after: 120 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'B. Tujuan Pembelajaran (TP)',
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...rpp.tujuanPembelajaran.map(
            (tp, index) =>
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `${index + 1}. ${tp}`, size: 22 }),
                ],
              })
          ),

          new Paragraph({
            spacing: { before: 240, after: 120 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'C. Langkah-Langkah Kegiatan Pembelajaran',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '1. Kegiatan Pendahuluan:',
                bold: true,
                size: 22,
              }),
            ],
          }),
          ...rpp.langkahPembelajaran.pendahuluan.map(
            (step) =>
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: `• ${step}`, size: 22 })],
              })
          ),
          new Paragraph({
            spacing: { before: 120, after: 80 },
            children: [
              new TextRun({ text: '2. Kegiatan Inti:', bold: true, size: 22 }),
            ],
          }),
          ...rpp.langkahPembelajaran.kegiatanInti.map(
            (step) =>
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: `• ${step}`, size: 22 })],
              })
          ),
          new Paragraph({
            spacing: { before: 120, after: 80 },
            children: [
              new TextRun({ text: '3. Kegiatan Penutup:', bold: true, size: 22 }),
            ],
          }),
          ...rpp.langkahPembelajaran.penutup.map(
            (step) =>
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: `• ${step}`, size: 22 })],
              })
          ),

          new Paragraph({
            spacing: { before: 240, after: 120 },
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'D. Rencana Asesmen & Strategi Diferensiasi',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Asesmen Diagnostik: ', bold: true, size: 22 }),
              new TextRun({ text: rpp.asesmen.diagnostik, size: 22 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Asesmen Formatif: ', bold: true, size: 22 }),
              new TextRun({ text: rpp.asesmen.formatif, size: 22 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: '• Asesmen Sumatif: ', bold: true, size: 22 }),
              new TextRun({ text: rpp.asesmen.sumatif, size: 22 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Diferensiasi Konten: ', bold: true, size: 22 }),
              new TextRun({ text: rpp.diferensiasi.konten, size: 22 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: '• Diferensiasi Proses: ', bold: true, size: 22 }),
              new TextRun({ text: rpp.diferensiasi.proses, size: 22 }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: '• Diferensiasi Produk: ', bold: true, size: 22 }),
              new TextRun({ text: rpp.diferensiasi.produk, size: 22 }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeFileName = `${rpp.formatDokumen.replace(/\s+/g, '_')}_${rpp.identitas.mataPelajaran
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 18)}_${rpp.identitas.kelas.replace(/\s+/g, '_')}_SDN_Karanggintung_06.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = safeFileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return safeFileName;
}
