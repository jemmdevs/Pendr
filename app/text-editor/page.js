import AdvancedTextEditor from '../components/text-editor/AdvancedTextEditor';
import Header from '../components/Header';

export default function TextEditorPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Text Editor</h1>
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <AdvancedTextEditor />
        </div>
      </div>
    </>
  );
} 