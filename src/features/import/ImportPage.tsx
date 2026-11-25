import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <>
      <h2>CSV-Import</h2>
      <Card>
        <label className="file-label">
          <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <span>{file ? file.name : 'CSV-Datei wählen…'}</span>
        </label>
        <Button accent="mint" disabled>
          Importieren
        </Button>
      </Card>
    </>
  );
}
