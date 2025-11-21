import { TargetsButton } from '@/components/ui/targetButton';
import { Props, PropsFilterBar } from '@/types/target.types';
import axios from 'axios';
import { BUTTON_TYPES } from '@/constants/button_types';
import { FileSearchIcon, PlayIcon, SearchIcon } from 'lucide-react';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

export const FilterBar = ({ onButtonClick, selectedButton, isLoading }: PropsFilterBar) => {
  const handleButtonClick = (buttonType: ButtonType) => {
    onButtonClick(buttonType);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      {/* Container principale responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Gruppo bottoni di sinistra */}
        <div className="flex flex-wrap items-center gap-2">
          {/* <TargetsButton
            variant={activeButton === BUTTON_TYPES.NEW ? 'default' : 'default'}
            size="sm"
            className={`whitespace-nowrap ${
              activeButton === BUTTON_TYPES.NEW
                ? 'bg-blue-800 text-white hover:bg-blue-900'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            leftIcon="📄"
            loading={isLoading[BUTTON_TYPES.NEW]}
            onClick={() => handleButtonClick(BUTTON_TYPES.NEW)}
          >
            📄 New 10
          </TargetsButton>
          <TargetsButton
            variant="outline"
            size="sm"
            className={`whitespace-nowrap ${
              activeButton === BUTTON_TYPES.GDPR
                ? 'border-blue-800 text-blue-800 bg-blue-50' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            leftIcon="🛡️"
            loading={isLoading[BUTTON_TYPES.GDPR]}
            onClick={() => handleButtonClick(BUTTON_TYPES.GDPR)}
          >
            GDPR 12
          </TargetsButton>
          <TargetsButton
            variant="outline"
            size="sm"
            className={`whitespace-nowrap ${
              activeButton === BUTTON_TYPES.PCI_DSS
                ? 'border-blue-800 text-blue-800 bg-blue-50' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            leftIcon="🏛️"
            loading={isLoading[BUTTON_TYPES.PCI_DSS]}
            onClick={() => handleButtonClick(BUTTON_TYPES.PCI_DSS)}
          >
            PCI DSS 23
          </TargetsButton> */}
        </div>

        {/* Gruppo bottoni di destra con scroll orizzontale su mobile */}
        <div className="flex-1 lg:flex-initial">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <div className="flex items-center gap-2 min-w-max">
              <TargetsButton
                variant="success"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.SCAN_NOW ? 'bg-green-700 hover:bg-green-800' : ''
                }`}
                leftIcon="🔍"
                loading={isLoading[BUTTON_TYPES.SCAN_NOW]}
                onClick={() => handleButtonClick(BUTTON_TYPES.SCAN_NOW)}
              >
                Scan Now
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.SEARCH
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="🔍"
                loading={isLoading[BUTTON_TYPES.SEARCH]}
                onClick={() => handleButtonClick(BUTTON_TYPES.SEARCH)}
              >
                {/* <FileSearchIcon className="w-4 h-4 text-grey-800" /> */}
                Search and Filters
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.TAGS
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="🏷️"
                loading={isLoading[BUTTON_TYPES.TAGS]}
                onClick={() => handleButtonClick(BUTTON_TYPES.TAGS)}
              >
                Tags
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.ADD_TARGET
                    ? 'text-green-800 bg-green-100'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                leftIcon="➕"
                loading={isLoading[BUTTON_TYPES.ADD_TARGET]}
                onClick={() => handleButtonClick(BUTTON_TYPES.ADD_TARGET)}
              >
                Add Target
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.IMPORT_TARGETS
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="📥"
                loading={isLoading[BUTTON_TYPES.IMPORT_TARGETS]}
                onClick={() => handleButtonClick(BUTTON_TYPES.IMPORT_TARGETS)}
              >
                Import Targets
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.CI_CD
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="🔗"
                loading={isLoading[BUTTON_TYPES.CI_CD]}
                onClick={() => handleButtonClick(BUTTON_TYPES.CI_CD)}
              >
                CI/CD Integrations
              </TargetsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
