import os, sys
sys.stdout.reconfigure(encoding='utf-8')

projects_dir = r'c:\Users\NovaSole Pakistan\Desktop\Antigravity\mak\projects'
for f in sorted(os.listdir(projects_dir)):
    if f.endswith('.md'):
        path = os.path.join(projects_dir, f)
        with open(path, 'r', encoding='utf-8') as fh:
            lines = fh.readlines()[:10]
        print("=== " + f)
        for line in lines:
            text = line.strip()
            if text:
                print("  " + text)
        print()
