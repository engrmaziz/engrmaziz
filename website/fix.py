with open('app/about/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('variant="secondary"', 'variant="default"')

with open('app/about/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done - replaced all variant=secondary with variant=default')
