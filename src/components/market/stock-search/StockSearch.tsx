
import React from 'react';
import { Card } from '@/components/ui/card';
import { StockSearchHeader } from './StockSearchHeader';
import { StockSearchForm } from './StockSearchForm';
import { StockDetails } from './StockDetails';
import { useStockSearch } from './hooks/useStockSearch';

export const StockSearch: React.FC = () => {
  const {
    symbol,
    stockData,
    searchQuery,
    searchResults,
    chartData,
    loading,
    timeRange,
    recentSearches,
    handleSymbolChange,
    handleSearchQueryChange,
    handleSearch,
    handleGetQuote,
    handleTimeRangeChange,
  } = useStockSearch();

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <StockSearchHeader loading={loading} onRefresh={() => handleGetQuote(symbol)} />
        <StockSearchForm
          symbol={symbol}
          searchQuery={searchQuery}
          recentSearches={recentSearches}
          loading={loading}
          searchResults={searchResults}
          onSymbolChange={handleSymbolChange}
          onSearchQueryChange={handleSearchQueryChange}
          onSearch={handleSearch}
          onGetQuote={() => handleGetQuote()}
          onSelectStock={handleGetQuote}
        />
      </Card>
      
      {/* Stock Quote and Chart */}
      {stockData && (
        <StockDetails
          stockData={stockData}
          chartData={chartData}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      )}
    </div>
  );
};
