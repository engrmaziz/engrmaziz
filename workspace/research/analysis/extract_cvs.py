import pdfplumber
import os

cv_dir = r'c:\Users\NovaSole Pakistan\Desktop\Antigravity\mak\cvs'
for f in sorted(os.listdir(cv_dir)):
    if f.endswith('.pdf'):
        path = os.path.join(cv_dir, f)
        print("=" * 80)
        print("FILE: " + f)
        print("=" * 80)
        try:
            with pdfplumber.open(path) as pdf:
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    if text:
                        print("--- Page " + str(i+1) + " ---")
                        print(text)
        except Exception as e:
            print("ERROR: " + str(e))
        print()
