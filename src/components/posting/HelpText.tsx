
interface HelpTextProps {
  listingType: 'offer' | 'wanted';
}

const HelpText: React.FC<HelpTextProps> = ({ listingType }) => {
  if (listingType === 'wanted') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips for better responses:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about what you're looking for</li>
          <li>• Include your preferred condition (new, used, etc.)</li>
          <li>• Mention your timeline or urgency</li>
          <li>• Add any size, color, or model preferences</li>
        </ul>
      </div>
    );
  }
  return null;
};

export default HelpText;
