'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Undo, Redo,
  Palette, Highlighter, Copy, Check, Search, FileX, Settings,
  X, RefreshCw, Terminal, Hash, FileText, ScanSearch, Replace,
  Type, ArrowUpDown, Eye, Book
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AdvancedTextEditor() {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedRemoveOption, setSelectedRemoveOption] = useState('');
  const [customPattern, setCustomPattern] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  const [showCapitalizationDialog, setShowCapitalizationDialog] = useState(false);
  const [showBionicReaderDialog, setShowBionicReaderDialog] = useState(false);
  const [showTextStatsDialog, setShowTextStatsDialog] = useState(false);
  const [textStats, setTextStats] = useState({ words: 0, characters: 0, paragraphs: 0 });
  
  const searchInputRef = useRef(null);
  const textColorRef = useRef(null);
  const highlightColorRef = useRef(null);
  const editorContainerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: 'Type here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
  });

  // Clear inputs when dialogs are closed
  useEffect(() => {
    if (!showSearchDialog) {
      setSearchTerm('');
      setReplaceTerm('');
      setUseRegex(false);
    }
  }, [showSearchDialog]);

  useEffect(() => {
    if (!showRemoveDialog) {
      setSelectedRemoveOption('');
      setCustomPattern('');
    }
  }, [showRemoveDialog]);

  // Make the entire editor area clickable
  useEffect(() => {
    const handleContainerClick = (e) => {
      if (editor && e.target === editorContainerRef.current) {
        editor.commands.focus();
      }
    };

    if (editorContainerRef.current) {
      editorContainerRef.current.addEventListener('click', handleContainerClick);
    }

    return () => {
      if (editorContainerRef.current) {
        editorContainerRef.current.removeEventListener('click', handleContainerClick);
      }
    };
  }, [editor]);

  // Automatically update text statistics when content changes
  useEffect(() => {
    if (editor) {
      const updateStats = () => {
        const text = editor.getText();
        const html = editor.getHTML();
        
        // Count words - split by whitespace and filter out empty strings
        const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
        
        // Count characters - excluding spaces
        const charCount = text.replace(/\s/g, '').length;
        
        // Count paragraphs (p tags) - only count non-empty paragraphs
        const paragraphs = html.match(/<p>(.*?)<\/p>/g) || [];
        const nonEmptyParagraphs = paragraphs.filter(p => {
          // Remove HTML tags and check if there's actual content
          const content = p.replace(/<\/?[^>]+(>|$)/g, '').trim();
          return content.length > 0;
        });
        const paragraphCount = nonEmptyParagraphs.length || 1;
        
        setTextStats({
          words: wordCount,
          characters: charCount,
          paragraphs: paragraphCount
        });
      };

      // Initial update
      updateStats();
      
      // Update on content change
      editor.on('update', updateStats);
      
      return () => {
        editor.off('update', updateStats);
      };
    }
  }, [editor]);

  const copyToClipboard = () => {
    if (!editor) return;
    
    // Get plain text from editor
    const text = editor.getText();
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      // Show success confirmation
      setCopySuccess(true);
      // Hide confirmation after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  const handleReplace = () => {
    if (!editor || !searchTerm) return;
    
    try {
      const content = editor.getHTML();
      const searchRegex = useRegex 
        ? new RegExp(searchTerm, 'g') 
        : new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      
      const newContent = content.replace(searchRegex, replaceTerm);
      editor.commands.setContent(newContent);
      
      // Close dialog after replacing
      setShowSearchDialog(false);
    } catch (error) {
      alert("Replace error: " + error.message);
    }
  };
  
  const handleRemoveElements = () => {
    if (!editor || !selectedRemoveOption) return;
    
    try {
      // Create a temporary element to work with the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editor.getHTML();
      
      // Get all text nodes within the element
      const textNodes = [];
      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }
      
      // Define pattern based on selected option
      let pattern;
      switch (selectedRemoveOption) {
        case 'numbers':
          pattern = /\d+/g;
          break;
        case 'symbols':
          pattern = /[^\w\s]/g;
          break;
        case 'custom':
          if (!customPattern.trim()) {
            alert("Please enter a custom pattern");
            return;
          }
          try {
            pattern = new RegExp(customPattern, 'g');
          } catch (error) {
            alert("Invalid custom pattern. Please check your regular expression.");
            return;
          }
          break;
        default:
          return;
      }
      
      // Apply removal only to text content, preserving HTML structure
      textNodes.forEach(textNode => {
        textNode.nodeValue = textNode.nodeValue.replace(pattern, '');
      });
      
      // Set updated content
      editor.commands.setContent(tempDiv.innerHTML);
      
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Error removing elements:", error);
      alert("An error occurred while processing the text. Please try again.");
    }
  };
  
  const clearFormatting = () => {
    if (!editor) return;
    
    // Get only plain text
    const plainText = editor.getText();
    
    // Reset content as plain text in paragraphs
    editor.commands.setContent(`<p>${plainText}</p>`);
  };
  
  const convertToPlainText = () => {
    if (!editor) return;
    const text = editor.getText();
    navigator.clipboard.writeText(text).then(() => {
      alert("Plain text copied to clipboard");
    });
  };

  const convertToHTML = () => {
    if (!editor) return;
    const html = editor.getHTML();
    navigator.clipboard.writeText(html).then(() => {
      alert("HTML copied to clipboard");
    });
  };

  const handleCloseSearchDialog = () => {
    setShowSearchDialog(false);
  };

  const handleCloseRemoveDialog = () => {
    setShowRemoveDialog(false);
  };

  const handleTextColorChange = (e) => {
    const color = e.target.value;
    setTextColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleHighlightColorChange = (e) => {
    const color = e.target.value;
    setHighlightColor(color);
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  const handleCloseCapitalizationDialog = () => {
    setShowCapitalizationDialog(false);
  };

  const handleCloseBionicReaderDialog = () => {
    setShowBionicReaderDialog(false);
  };

  const handleCloseTextStatsDialog = () => {
    setShowTextStatsDialog(false);
  };

  // Bionic Reader implementation
  const applyBionicReader = () => {
    if (!editor) return;
    
    try {
      // Create a temporary element to work with the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editor.getHTML();
      
      // Find all text nodes
      const textNodes = [];
      const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.trim()) {
          textNodes.push(node);
        }
      }
      
      // Process each text node with bionic reading transformation
      textNodes.forEach(textNode => {
        const words = textNode.textContent.split(/\s+/);
        
        const bionicWords = words.map(word => {
          // Only apply to words with 3 or more letters
          if (word.length < 3) return word;
          
          // Always bold the first 2 letters
          const boldPart = word.substring(0, 2);
          const restPart = word.substring(2);
          
          return `<strong>${boldPart}</strong>${restPart}`;
        });
        
        // Create a new span element with the bionic text
        const newSpan = document.createElement('span');
        newSpan.innerHTML = bionicWords.join(' ');
        
        // Replace the original text node with our new span
        textNode.parentNode.replaceChild(newSpan, textNode);
      });
      
      // Set updated content
      editor.commands.setContent(tempDiv.innerHTML);
      setShowBionicReaderDialog(false);
    } catch (error) {
      console.error("Error applying bionic reader:", error);
      alert("An error occurred while processing the text. Please try again.");
    }
  };

  // Capitalization tools
  const applyCapitalization = (type) => {
    if (!editor) return;
    
    try {
      const text = editor.getText();
      let transformedText = '';
      
      switch (type) {
        case 'uppercase':
          transformedText = text.toUpperCase();
          break;
        case 'lowercase':
          transformedText = text.toLowerCase();
          break;
        case 'titlecase':
          transformedText = text
            .toLowerCase()
            .split(' ')
            .map(word => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
          break;
        case 'sentencecase':
          transformedText = text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
          break;
        default:
          transformedText = text;
      }
      
      editor.commands.setContent(`<p>${transformedText}</p>`);
      setShowCapitalizationDialog(false);
    } catch (error) {
      console.error("Error applying capitalization:", error);
      alert("An error occurred while processing the text. Please try again.");
    }
  };

  // Calculate text statistics for the dialog
  const calculateTextStats = () => {
    if (!editor) return;
    
    try {
      const text = editor.getText();
      const html = editor.getHTML();
      
      // Count words - split by whitespace and filter out empty strings
      const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      
      // Count characters - excluding spaces
      const charCount = text.replace(/\s/g, '').length;
      
      // Count paragraphs (p tags) - only count non-empty paragraphs
      const paragraphs = html.match(/<p>(.*?)<\/p>/g) || [];
      const nonEmptyParagraphs = paragraphs.filter(p => {
        // Remove HTML tags and check if there's actual content
        const content = p.replace(/<\/?[^>]+(>|$)/g, '').trim();
        return content.length > 0;
      });
      const paragraphCount = nonEmptyParagraphs.length || 1;
      
      setTextStats({
        words: wordCount,
        characters: charCount,
        paragraphs: paragraphCount
      });
      
      setShowTextStatsDialog(true);
    } catch (error) {
      console.error("Error calculating text statistics:", error);
      alert("An error occurred while analyzing the text. Please try again.");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded border mb-4 shadow-sm">
        {/* Text format buttons */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive('bold') ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive('italic') ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive('underline') ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>
        </div>

        {/* Alignment buttons */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Justify"
          >
            <AlignJustify size={18} />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${!editor.can().undo() ? 'opacity-50 bg-gray-100' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${!editor.can().redo() ? 'opacity-50 bg-gray-100' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>

        {/* Font and color selectors */}
        <div className="flex gap-1 border-r pr-2">
          <select
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            className="p-2 rounded border bg-white text-gray-800 shadow-sm"
            title="Font"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <div className="flex items-center justify-center w-10 h-10 border rounded bg-white shadow-sm relative">
            <Palette size={22} className="text-gray-700" />
            <input
              ref={textColorRef}
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Text Color"
            />
          </div>
          <div className="flex items-center justify-center w-10 h-10 border rounded bg-white shadow-sm relative">
            <Highlighter size={22} className="text-gray-700" />
            <input
              ref={highlightColorRef}
              type="color"
              value={highlightColor}
              onChange={handleHighlightColorChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Highlight Color"
            />
          </div>
        </div>

        {/* Advanced tools toggle and copy button */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className={`p-2 rounded hover:bg-indigo-100 transition-colors ${showAdvancedTools ? 'bg-indigo-200 text-indigo-800' : 'text-gray-800 bg-white shadow-sm border'}`}
            title="Advanced Tools"
          >
            <Settings size={18} />
            <span className="ml-1">Advanced</span>
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-2 rounded text-gray-800 bg-white shadow-sm border hover:bg-indigo-100 transition-colors flex items-center gap-1"
            title="Copy All Text"
          >
            {copySuccess ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            <span>{copySuccess ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Advanced Tools Panel - Visible when showAdvancedTools is true */}
      {showAdvancedTools && (
        <div className="bg-gray-100 border rounded p-3 mb-4 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Advanced Tools</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* First Column */}
            <div className="flex flex-col gap-3">
              {/* Search and Replace */}
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-center gap-1 mb-2 text-gray-800 font-medium">
                  <Search size={16} />
                  <h4 className="text-gray-800">Search and Replace</h4>
                </div>
                <button 
                  onClick={() => {
                    setShowSearchDialog(true);
                    setTimeout(() => {
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }, 100);
                  }}
                  className="w-full p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                >
                  <ScanSearch size={16} />
                  <span>Search and Replace</span>
                </button>
              </div>
              
              {/* Text Statistics */}
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-center gap-1 mb-2 text-gray-800 font-medium">
                  <Book size={16} />
                  <h4 className="text-gray-800">Text Statistics</h4>
                </div>
                <button 
                  onClick={calculateTextStats}
                  className="w-full p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                >
                  <Hash size={16} />
                  <span>Word & Character Count</span>
                </button>
              </div>
            </div>
            
            {/* Second Column */}
            <div className="flex flex-col gap-3">
              {/* Selective Removal */}
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-center gap-1 mb-2 text-gray-800 font-medium">
                  <X size={16} />
                  <h4 className="text-gray-800">Selective Removal</h4>
                </div>
                <button 
                  onClick={() => setShowRemoveDialog(true)}
                  className="w-full p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                >
                  <FileX size={16} />
                  <span>Remove Elements</span>
                </button>
              </div>
              
              {/* Capitalization Tools */}
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-center gap-1 mb-2 text-gray-800 font-medium">
                  <Type size={16} />
                  <h4 className="text-gray-800">Capitalization</h4>
                </div>
                <button 
                  onClick={() => setShowCapitalizationDialog(true)}
                  className="w-full p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                >
                  <ArrowUpDown size={16} />
                  <span>Change Case</span>
                </button>
              </div>
            </div>
            
            {/* Third Column */}
            <div className="flex flex-col gap-3">
              {/* Cleanup and Conversion */}
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-center gap-1 mb-2 text-gray-800 font-medium">
                  <RefreshCw size={16} />
                  <h4 className="text-gray-800">Cleanup and Conversion</h4>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={clearFormatting}
                    className="w-full p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                  >
                    <FileX size={16} />
                    <span>Clear Formatting</span>
                  </button>
                  <div className="flex gap-1">
                    <button 
                      onClick={convertToPlainText}
                      className="flex-1 p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                      title="Convert to Plain Text"
                    >
                      <Terminal size={16} />
                      <span>Plain Text</span>
                    </button>
                    <button 
                      onClick={convertToHTML}
                      className="flex-1 p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                      title="Convert to HTML"
                    >
                      <Hash size={16} />
                      <span>HTML</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Special Features */}
              <div className="bg-white p-3 rounded border shadow-sm">
                <div className="flex items-center gap-1 mb-2 text-gray-800 font-medium">
                  <Eye size={16} />
                  <h4 className="text-gray-800">Bionic Reader</h4>
                </div>
                <button 
                  onClick={() => setShowBionicReaderDialog(true)}
                  className="w-full p-2 bg-white border rounded hover:bg-indigo-50 transition-colors text-gray-800 flex items-center justify-center gap-1"
                >
                  <Eye size={16} />
                  <span>Bionic Reader</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div 
        ref={editorContainerRef}
        className="border rounded min-h-[50vh] bg-white shadow-sm relative cursor-text"
      >
        <EditorContent editor={editor} className="p-4 min-h-[50vh] text-gray-900" />
      </div>

      {/* Shows text statistics at the bottom of the editor */}
      <div className="mt-2 text-sm text-gray-600 flex items-center justify-end gap-4">
        <span>{textStats.words} words</span>
        <span>{textStats.characters} chars (no spaces)</span>
        <span>{textStats.paragraphs} paragraphs</span>
      </div>
      
      {/* Search and Replace Dialog */}
      {showSearchDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Search size={20} />
                Search and Replace
              </h3>
              <button 
                onClick={handleCloseSearchDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-800 mb-1">Search:</label>
              <input 
                type="text" 
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                placeholder="Text to search..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-800 mb-1">Replace with:</label>
              <input 
                type="text" 
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                placeholder="Replacement text..."
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useRegex}
                  onChange={() => setUseRegex(!useRegex)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-800">Use regular expressions</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleReplace}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
              >
                <Replace size={16} />
                <span>Replace</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Capitalization Dialog */}
      {showCapitalizationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Type size={20} />
                Change Text Case
              </h3>
              <button 
                onClick={handleCloseCapitalizationDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => applyCapitalization('uppercase')}
                className="p-3 border rounded hover:bg-indigo-50 transition-colors text-left flex items-center"
              >
                <div className="ml-2">
                  <div className="font-medium text-gray-800">UPPERCASE</div>
                  <div className="text-sm text-gray-600">Convert all text to uppercase</div>
                </div>
              </button>
              
              <button 
                onClick={() => applyCapitalization('lowercase')}
                className="p-3 border rounded hover:bg-indigo-50 transition-colors text-left flex items-center"
              >
                <div className="ml-2">
                  <div className="font-medium text-gray-800">lowercase</div>
                  <div className="text-sm text-gray-600">Convert all text to lowercase</div>
                </div>
              </button>
              
              <button 
                onClick={() => applyCapitalization('titlecase')}
                className="p-3 border rounded hover:bg-indigo-50 transition-colors text-left flex items-center"
              >
                <div className="ml-2">
                  <div className="font-medium text-gray-800">Title Case</div>
                  <div className="text-sm text-gray-600">Capitalize the first letter of each word</div>
                </div>
              </button>
              
              <button 
                onClick={() => applyCapitalization('sentencecase')}
                className="p-3 border rounded hover:bg-indigo-50 transition-colors text-left flex items-center"
              >
                <div className="ml-2">
                  <div className="font-medium text-gray-800">Sentence case</div>
                  <div className="text-sm text-gray-600">Capitalize the first letter of each sentence</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bionic Reader Dialog */}
      {showBionicReaderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Eye size={20} />
                Bionic Reader
              </h3>
              <button 
                onClick={handleCloseBionicReaderDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Bionic Reading helps you read faster by highlighting the most important parts of words. 
                This feature will bold the first two letters of each word that has three or more letters.
              </p>
              
              <div className="p-4 bg-gray-50 rounded border mb-4">
                <p className="text-gray-800">
                  <span className="font-bold">Ex</span>ample of <span className="font-bold">bi</span>onic <span className="font-bold">re</span>ading <span className="font-bold">ap</span>plied to <span className="font-bold">te</span>xt. It <span className="font-bold">on</span>ly <span className="font-bold">bo</span>lds <span className="font-bold">th</span>e <span className="font-bold">fi</span>rst <span className="font-bold">tw</span>o <span className="font-bold">le</span>tters.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={applyBionicReader}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
              >
                <Eye size={16} />
                <span>Apply Bionic Reading</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Text Statistics Dialog */}
      {showTextStatsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Book size={20} />
                Text Statistics
              </h3>
              <button 
                onClick={handleCloseTextStatsDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-4 rounded border">
                <div className="text-gray-600 mb-1">Words</div>
                <div className="text-3xl font-bold text-indigo-600">{textStats.words}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <div className="text-gray-600 mb-1">Characters (excluding spaces)</div>
                <div className="text-3xl font-bold text-indigo-600">{textStats.characters}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <div className="text-gray-600 mb-1">Non-empty Paragraphs</div>
                <div className="text-3xl font-bold text-indigo-600">{textStats.paragraphs}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <div className="text-gray-600 mb-1">Reading Time (approx.)</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {Math.max(1, Math.round(textStats.words / 200))} min
                </div>
                <div className="text-sm text-gray-500 mt-1">Based on average reading speed of 200 words per minute</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Remove Elements Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <FileX size={20} />
                Remove Elements
              </h3>
              <button 
                onClick={handleCloseRemoveDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-800 mb-2">Select what to remove:</label>
              
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="removeOption"
                    value="numbers"
                    checked={selectedRemoveOption === 'numbers'}
                    onChange={() => setSelectedRemoveOption('numbers')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-800">Remove all numbers</span>
                </label>
                
                <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="removeOption"
                    value="symbols"
                    checked={selectedRemoveOption === 'symbols'}
                    onChange={() => setSelectedRemoveOption('symbols')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-800">Remove symbols and special characters</span>
                </label>
                
                <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="removeOption"
                    value="custom"
                    checked={selectedRemoveOption === 'custom'}
                    onChange={() => setSelectedRemoveOption('custom')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-800">Custom pattern (regex)</span>
                </label>
              </div>
              
              {selectedRemoveOption === 'custom' && (
                <div className="mt-3">
                  <input 
                    type="text" 
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                    placeholder="Ex: \b(word1|word2)\b"
                  />
                  <p className="text-xs text-gray-700 mt-1">
                    Enter a regular expression. Ex: \d+ for numbers, \b(word1|word2)\b for specific words.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleRemoveElements}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
                disabled={!selectedRemoveOption}
              >
                <FileX size={16} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .ProseMirror {
          color: #000;
          font-size: 16px;
          line-height: 1.5;
          min-height: calc(50vh - 32px); /* Match container minus padding */
          width: 100%;
        }
        .ProseMirror p {
          color: #000;
          margin-bottom: 1em;
        }
        .ProseMirror:focus {
          outline: none;
        }
        /* Placeholder styles */
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        /* Improve contrast of elements within the editor */
        .ProseMirror ul li, 
        .ProseMirror ol li {
          color: #000;
        }
        .ProseMirror h1, 
        .ProseMirror h2, 
        .ProseMirror h3, 
        .ProseMirror h4, 
        .ProseMirror h5, 
        .ProseMirror h6 {
          color: #000;
          font-weight: bold;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          color: #000;
        }
      `}</style>
    </div>
  );
} 