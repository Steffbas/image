import os
import json
import csv
import datetime
import urllib.parse

# Configuration
CATEGORIES = ['mariages', 'nature-paysages', 'portrait-reportages', 'urbain', 'creatif']
IMG_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.svg', '.webp')
CSV_FILE = 'data/portfolio.csv'

def load_csv():
    data = {}
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f, delimiter=';')
            for row in reader:
                if row.get('Fichier'):
                    data[row['Fichier']] = row
    return data

def save_csv(rows):
    os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)
    with open(CSV_FILE, 'w', newline='', encoding='utf-8-sig') as f:
        fieldnames = ['Fichier', 'Categorie', 'Titre', 'Annee', 'Description']
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        writer.writerows(rows)

def sync():
    existing_data = load_csv()
    final_rows = []
    gallery_data = []

    for cat in CATEGORIES:
        img_dir = os.path.join('images', cat)
        if not os.path.exists(img_dir): continue
            
        for filename in sorted(os.listdir(img_dir)):
            if filename.lower().endswith(IMG_EXTENSIONS):
                if filename in existing_data:
                    row = existing_data[filename]
                    row['Categorie'] = cat
                else:
                    full_path = os.path.join(img_dir, filename)
                    year = datetime.datetime.fromtimestamp(os.path.getmtime(full_path)).strftime('%Y')
                    title = os.path.splitext(filename)[0].replace('_', ' ').replace('-', ' ').title().replace("'", "•").replace("é", "e")
                    row = {
                        'Fichier': filename,
                        'Categorie': cat,
                        'Titre': title,
                        'Annee': year,
                        'Description': f"Description pour {title}..."
                    }
                
                final_rows.append(row)
                
                # Encodage pour URL
                safe_filename = urllib.parse.quote(filename)
                img_path = f"images/{cat}/{safe_filename}"
                
                gallery_data.append({
                    "id": filename,
                    "category": cat,
                    "src": img_path,
                    "title": row['Titre'],
                    "year": row['Annee'],
                    "description": row['Description'] # La description est incluse ici !
                })

    save_csv(final_rows)

    # On écrit TOUT dans js/data.js
    with open('js/data.js', 'w', encoding='utf-8') as f:
        f.write(f"const GALLERY_DATA = {json.dumps(gallery_data, indent=2, ensure_ascii=False)};")

    print(f"✅ Synchro terminée : {len(gallery_data)} photos intégrées avec leurs descriptions.")

if __name__ == "__main__":
    sync()
