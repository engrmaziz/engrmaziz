import pdfplumber
import os

cv_dir = r'c:\Users\NovaSole Pakistan\Desktop\Antigravity\mak\cvs'
cert_dir = r'c:\Users\NovaSole Pakistan\Desktop\Antigravity\mak\certifications'
out_path = r'c:\Users\NovaSole Pakistan\Desktop\Antigravity\mak\analysis\extracted_text.md'

with open(out_path, 'w', encoding='utf-8') as out:
    # Extract CVs
    out.write("# EXTRACTED CV TEXT\n\n")
    for f in sorted(os.listdir(cv_dir)):
        if f.endswith('.pdf'):
            path = os.path.join(cv_dir, f)
            out.write("=" * 80 + "\n")
            out.write("## FILE: " + f + "\n")
            out.write("=" * 80 + "\n\n")
            try:
                with pdfplumber.open(path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        text = page.extract_text()
                        if text:
                            out.write("### Page " + str(i+1) + "\n\n")
                            out.write(text + "\n\n")
            except Exception as e:
                out.write("ERROR: " + str(e) + "\n\n")

    # Extract DOCX
    out.write("\n\n# EXTRACTED DOCX TEXT\n\n")
    try:
        import docx
        for f in sorted(os.listdir(cv_dir)):
            if f.endswith('.docx'):
                path = os.path.join(cv_dir, f)
                out.write("=" * 80 + "\n")
                out.write("## FILE: " + f + "\n")
                out.write("=" * 80 + "\n\n")
                try:
                    doc = docx.Document(path)
                    for para in doc.paragraphs:
                        out.write(para.text + "\n")
                    out.write("\n")
                except Exception as e:
                    out.write("ERROR: " + str(e) + "\n\n")
    except ImportError:
        out.write("python-docx not available\n")

    # Extract Certifications
    out.write("\n\n# EXTRACTED CERTIFICATION TEXT\n\n")
    for f in sorted(os.listdir(cert_dir)):
        if f.endswith('.pdf'):
            path = os.path.join(cert_dir, f)
            out.write("=" * 80 + "\n")
            out.write("## FILE: " + f + "\n")
            out.write("=" * 80 + "\n\n")
            try:
                with pdfplumber.open(path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        text = page.extract_text()
                        if text:
                            out.write("### Page " + str(i+1) + "\n\n")
                            out.write(text + "\n\n")
                        else:
                            out.write("### Page " + str(i+1) + " (NO TEXT - likely image/scan)\n\n")
            except Exception as e:
                out.write("ERROR: " + str(e) + "\n\n")

print("Done. Output at: " + out_path)
