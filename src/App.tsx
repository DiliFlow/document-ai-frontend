import React, { useState } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function App() {
  const [uploadResult, setUploadResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [summarizeText, setSummarizeText] = useState('');
  const [summary, setSummary] = useState('');

  const uploadHandler = (event: any) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => setUploadResult(data))
      .catch(err => console.error(err));
  };

  const searchHandler = () => {
    fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    })
      .then(res => res.json())
      .then(data => setSearchResults(data))
      .catch(err => console.error(err));
  };

  const summarizeHandler = () => {
    fetch(`${API_BASE}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: summarizeText })
    })
      .then(res => res.json())
      .then(data => setSummary(data.summary))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-grid p-justify-center p-mt-5">
      <div className="p-col-8">
        <h2>Document AI</h2>

        <section className="p-mb-5">
          <h3>Upload Document</h3>
          <FileUpload name="file" customUpload uploadHandler={uploadHandler} />
          {uploadResult && <pre>{JSON.stringify(uploadResult, null, 2)}</pre>}
        </section>

        <section className="p-mb-5">
          <h3>Semantic Search</h3>
          <div className="p-inputgroup">
            <InputText value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Enter search query" />
            <Button label="Search" onClick={searchHandler} />
          </div>
          <DataTable value={searchResults} className="p-mt-3">
            <Column field="filename" header="Filename" />
            <Column field="score" header="Score" />
          </DataTable>
        </section>

        <section>
          <h3>Summarize Text</h3>
          <InputText
            value={summarizeText}
            onChange={e => setSummarizeText(e.target.value)}
            placeholder="Enter text to summarize"
            style={{ width: '100%' }}
          />
          <Button label="Summarize" onClick={summarizeHandler} className="p-mt-2" />
          {summary && <div className="p-mt-3"><strong>Summary:</strong> {summary}</div>}
        </section>
      </div>
    </div>
  );
}
