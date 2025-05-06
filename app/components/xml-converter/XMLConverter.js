'use client';

import { useState, useEffect } from 'react';
import { FileCode, Code, Download, Copy, Trash, RefreshCw, ArrowLeftRight, AlertTriangle } from 'lucide-react';

export default function XMLConverter() {
  const [inputXML, setInputXML] = useState('');
  const [outputFormat, setOutputFormat] = useState('json'); // 'json', 'yaml', 'html'
  const [convertedOutput, setConvertedOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [prettify, setPrettify] = useState(true);
  const [validationMode, setValidationMode] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // Efecto para validar XML cuando cambia
  useEffect(() => {
    if (validationMode && inputXML) {
      validateXML(inputXML);
    } else {
      setValidationResult(null);
    }
  }, [inputXML, validationMode]);

  // Función para validar XML
  const validateXML = (xml) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Verificar si hay errores de parseo
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      
      if (parseError.length > 0) {
        setValidationResult({
          valid: false,
          message: "Invalid XML: " + parseError[0].textContent
        });
      } else {
        setValidationResult({
          valid: true,
          message: "XML is valid"
        });
      }
    } catch (err) {
      setValidationResult({
        valid: false,
        message: "Error validating XML: " + err.message
      });
    }
  };

  // Función para convertir XML a JSON
  const convertToJSON = (xml) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Verificar si hay errores de parseo
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Invalid XML: " + parseError[0].textContent);
      }
      
      // Función recursiva para convertir nodos XML a objetos JSON
      const convertNodeToJSON = (node) => {
        const obj = {};
        
        // Procesar atributos
        if (node.attributes && node.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attribute = node.attributes[i];
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
        
        // Procesar nodos hijos
        if (node.hasChildNodes()) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            
            // Ignorar nodos de texto vacíos o con solo espacios en blanco
            if (child.nodeType === 3 && (!child.nodeValue.trim())) continue;
            
            // Nodo de texto
            if (child.nodeType === 3) {
              // Si solo hay un nodo de texto, asignar su valor directamente
              if (node.childNodes.length === 1) {
                return child.nodeValue.trim();
              } else {
                obj["#text"] = child.nodeValue.trim();
              }
            }
            // Nodo de elemento
            else if (child.nodeType === 1) {
              const childObj = convertNodeToJSON(child);
              
              // Manejar elementos repetidos
              if (obj[child.nodeName]) {
                if (!Array.isArray(obj[child.nodeName])) {
                  obj[child.nodeName] = [obj[child.nodeName]];
                }
                obj[child.nodeName].push(childObj);
              } else {
                obj[child.nodeName] = childObj;
              }
            }
          }
        }
        
        return obj;
      };
      
      const result = {};
      result[xmlDoc.documentElement.nodeName] = convertNodeToJSON(xmlDoc.documentElement);
      
      return prettify 
        ? JSON.stringify(result, null, 2) 
        : JSON.stringify(result);
    } catch (err) {
      throw new Error("Error converting XML to JSON: " + err.message);
    }
  };

  // Función para convertir XML a YAML
  const convertToYAML = (xml) => {
    try {
      // Primero convertimos a JSON
      const jsonObj = JSON.parse(convertToJSON(xml));
      
      // Función para convertir JSON a YAML
      const jsonToYAML = (obj, indent = 0) => {
        let yaml = '';
        const spaces = ' '.repeat(indent);
        
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            
            if (value === null) {
              yaml += `${spaces}${key}: null\n`;
            } else if (typeof value === 'object' && !Array.isArray(value)) {
              yaml += `${spaces}${key}:\n`;
              yaml += jsonToYAML(value, indent + 2);
            } else if (Array.isArray(value)) {
              yaml += `${spaces}${key}:\n`;
              value.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                  yaml += `${spaces}- \n`;
                  yaml += jsonToYAML(item, indent + 4).replace(/^/gm, '  ' + spaces);
                } else {
                  yaml += `${spaces}- ${item}\n`;
                }
              });
            } else {
              // Escapar valores especiales en YAML
              let formattedValue = value;
              if (typeof value === 'string') {
                if (value.includes('\n') || value.includes('"') || value.includes("'")) {
                  formattedValue = `|\n${spaces}  ${value.replace(/\n/g, `\n${spaces}  `)}`;
                } else if (value === '' || /^[0-9]+$/.test(value) || value === 'true' || value === 'false' || value === 'null') {
                  formattedValue = `'${value}'`;
                }
              }
              yaml += `${spaces}${key}: ${formattedValue}\n`;
            }
          }
        }
        
        return yaml;
      };
      
      return jsonToYAML(jsonObj);
    } catch (err) {
      throw new Error("Error converting XML to YAML: " + err.message);
    }
  };

  // Función para convertir XML a HTML
  const convertToHTML = (xml) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Verificar si hay errores de parseo
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Invalid XML: " + parseError[0].textContent);
      }
      
      // Función recursiva para convertir nodos XML a HTML
      const convertNodeToHTML = (node, indent = 0) => {
        const spaces = prettify ? ' '.repeat(indent) : '';
        let html = '';
        
        // Procesar nodos hijos
        if (node.hasChildNodes()) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            
            // Ignorar nodos de texto vacíos o con solo espacios en blanco
            if (child.nodeType === 3 && (!child.nodeValue.trim())) continue;
            
            // Nodo de texto
            if (child.nodeType === 3) {
              html += spaces + escapeHTML(child.nodeValue.trim()) + (prettify ? '\n' : '');
            }
            // Nodo de elemento
            else if (child.nodeType === 1) {
              const tagName = child.nodeName;
              const hasChildren = child.hasChildNodes();
              const hasNonTextChildren = Array.from(child.childNodes).some(n => n.nodeType !== 3);
              
              // Abrir etiqueta
              html += `${spaces}<span class="html-tag">&lt;${tagName}</span>`;
              
              // Procesar atributos
              if (child.attributes && child.attributes.length > 0) {
                for (let j = 0; j < child.attributes.length; j++) {
                  const attr = child.attributes[j];
                  html += ` <span class="html-attr">${attr.nodeName}</span>=<span class="html-value">"${escapeHTML(attr.nodeValue)}"</span>`;
                }
              }
              
              html += `<span class="html-tag">&gt;</span>`;
              
              // Contenido
              if (hasChildren) {
                if (hasNonTextChildren && prettify) {
                  html += '\n';
                }
                html += convertNodeToHTML(child, indent + 2);
                if (hasNonTextChildren && prettify) {
                  html += spaces;
                }
              }
              
              // Cerrar etiqueta
              html += `<span class="html-tag">&lt;/${tagName}&gt;</span>${prettify ? '\n' : ''}`;
            }
          }
        }
        
        return html;
      };
      
      // Escapar caracteres especiales HTML
      const escapeHTML = (str) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };
      
      // Agregar estilos CSS para la sintaxis destacada
      const css = `
      <style>
        .html-output {
          font-family: monospace;
          white-space: pre-wrap;
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          color: #333;
        }
        .html-tag { color: #0000ff; }
        .html-attr { color: #7d2727; }
        .html-value { color: #2a9d8f; }
      </style>
      `;
      
      return css + `<div class="html-output">${convertNodeToHTML(xmlDoc.documentElement)}</div>`;
    } catch (err) {
      throw new Error("Error converting XML to HTML: " + err.message);
    }
  };

  // Función principal para convertir XML
  const convertXML = () => {
    if (!inputXML.trim()) {
      setError("Please enter XML to convert");
      return;
    }
    
    setError('');
    
    try {
      let result = '';
      
      switch (outputFormat) {
        case 'json':
          result = convertToJSON(inputXML);
          break;
        case 'yaml':
          result = convertToYAML(inputXML);
          break;
        case 'html':
          result = convertToHTML(inputXML);
          break;
        default:
          result = convertToJSON(inputXML);
      }
      
      setConvertedOutput(result);
      
      // Guardar en historial
      const historyItem = {
        id: Date.now(),
        inputXML: inputXML,
        outputFormat: outputFormat,
        output: result,
        timestamp: new Date().toISOString()
      };
      
      setHistory(prev => [historyItem, ...prev].slice(0, 10)); // Mantener solo los últimos 10 items
    } catch (err) {
      setError(err.message);
      setConvertedOutput('');
    }
  };

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    if (convertedOutput) {
      // Para HTML, necesitamos extraer solo el contenido sin las etiquetas de estilo
      const content = outputFormat === 'html' 
        ? convertedOutput.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<\/?[^>]+(>|$)/g, '')
        : convertedOutput;
        
      navigator.clipboard.writeText(content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Función para descargar el resultado
  const downloadOutput = () => {
    if (!convertedOutput) return;
    
    const element = document.createElement('a');
    
    let content = convertedOutput;
    let filename = `converted_xml.${outputFormat}`;
    let mimeType = 'text/plain';
    
    if (outputFormat === 'html') {
      // Para HTML, crear un documento HTML completo
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Converted XML</title>
  ${content.match(/<style>[\s\S]*?<\/style>/)[0]}
</head>
<body>
  ${content.replace(/<style>[\s\S]*?<\/style>/, '')}
</body>
</html>`;
      mimeType = 'text/html';
    } else if (outputFormat === 'json') {
      mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Función para cargar un item del historial
  const loadFromHistory = (item) => {
    setInputXML(item.inputXML);
    setOutputFormat(item.outputFormat);
    setConvertedOutput(item.output);
    setShowHistory(false);
  };

  // Función para borrar el historial
  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  // Función para limpiar los campos
  const clearFields = () => {
    setInputXML('');
    setConvertedOutput('');
    setError('');
    setValidationResult(null);
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Función para obtener un ejemplo de XML
  const loadExample = () => {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">12.99</price>
  </book>
  <book category="non-fiction">
    <title>Sapiens: A Brief History of Humankind</title>
    <author>Yuval Noah Harari</author>
    <year>2011</year>
    <price currency="USD">15.99</price>
  </book>
</bookstore>`;
    
    setInputXML(example);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Controles principales */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={convertXML}
            className="px-4 py-2 bg-[#FF8C42] text-white rounded-md hover:bg-[#E67539] transition-colors flex items-center"
            disabled={!inputXML.trim()}
          >
            <ArrowLeftRight size={16} className="mr-2" />
            Convert
          </button>
          
          <div className="flex items-center">
            <label className="mr-2 text-gray-700">Output Format:</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            >
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="html">HTML</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="prettify"
              checked={prettify}
              onChange={(e) => setPrettify(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="prettify" className="text-gray-700">Prettify Output</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="validation"
              checked={validationMode}
              onChange={(e) => setValidationMode(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="validation" className="text-gray-700">Validate XML</label>
          </div>
          
          <button
            onClick={loadExample}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Load Example
          </button>
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          
          <button
            onClick={clearFields}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
        
        {/* Validación XML */}
        {validationMode && validationResult && (
          <div className={`mb-4 p-3 rounded-md ${validationResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center">
              {validationResult.valid ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <AlertTriangle size={20} className="mr-2" />
              )}
              <span>{validationResult.message}</span>
            </div>
          </div>
        )}
        
        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Historial */}
      {showHistory && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Conversion History</h3>
            <button
              onClick={clearHistory}
              className="text-red-600 hover:text-red-800"
              disabled={history.length === 0}
            >
              <Trash size={16} />
            </button>
          </div>
          
          {history.length === 0 ? (
            <p className="text-gray-500">No conversion history yet.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {history.map(item => (
                <li 
                  key={item.id}
                  className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        XML to {item.outputFormat.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {item.outputFormat.toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Área de entrada y salida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Entrada XML */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
            <FileCode size={20} className="mr-2 text-[#FF8C42]" />
            XML Input
          </h3>
          <textarea
            value={inputXML}
            onChange={(e) => setInputXML(e.target.value)}
            className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            placeholder="Paste your XML here..."
          ></textarea>
        </div>
        
        {/* Salida convertida */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Code size={20} className="mr-2 text-[#FF8C42]" />
              {outputFormat.toUpperCase()} Output
            </h3>
            
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={!convertedOutput}
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
              
              <button
                onClick={downloadOutput}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={!convertedOutput}
                title="Download output"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
          
          {copied && (
            <div className="mb-2 text-xs text-green-600">
              Copied to clipboard!
            </div>
          )}
          
          {outputFormat === 'html' && convertedOutput ? (
            <div 
              className="w-full h-80 p-3 border border-gray-300 rounded-md overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: convertedOutput }}
            ></div>
          ) : (
            <textarea
              value={convertedOutput}
              readOnly
              className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
              placeholder={`Converted ${outputFormat.toUpperCase()} will appear here...`}
            ></textarea>
          )}
        </div>
      </div>
    </div>
  );
}
