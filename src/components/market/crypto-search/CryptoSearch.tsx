
import React from 'react';
import { CryptoSearchForm } from './CryptoSearchForm';
import { CryptoDetails } from './CryptoDetails';
import { useCryptoSearch } from './hooks/useCryptoSearch';

const CryptoSearch: React.FC = () => {
  const {
    searchInput,
    searchQuery,
    cryptoData,
    trendingCryptos,
    chartData,
    isLoading,
    isTrendingLoading,
    isError,
    handleSearchInputChange,
    handleSearch,
    handleRefresh,
    handleTrendingClick,
  } = useCryptoSearch();

  return (
    <div className="space-y-6">
      <CryptoSearchForm
        searchInput={searchInput}
        loading={isLoading}
        trendingCryptos={trendingCryptos || []}
        isTrendingLoading={isTrendingLoading}
        onSearchInputChange={handleSearchInputChange}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onTrendingClick={handleTrendingClick}
      />
      
      {cryptoData && (
        <CryptoDetails
          cryptoData={cryptoData}
          chartData={chartData}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </div>
  );
};

export default CryptoSearch;
