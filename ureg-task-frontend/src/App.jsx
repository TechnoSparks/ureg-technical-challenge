import './App.css';
import { useState, useEffect } from 'react';
import { Layout, Flex, DatePicker, Row, Col, Alert, Button } from "antd";
const { Header, Content } = Layout;
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';

// components
import AppBar from './components/AppBar.jsx';
import ForexItem from './components/ForexItem.jsx';

function App() {
  // states for React --------------------------------
  const [loading, setLoading] = useState(true); // state if app is init
  const [loadingMore, setLoadingMore] = useState(false); // state for if loading more currencies
  const [forexData, setForexData] = useState([]); // state for holding the forex rates
  const [availableDates, setAvailableDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [today, setToday] = useState(() => dayjs().format('DD-MM-YYYY'));
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [error, setError] = useState(null);
  const [noRates, setNoRates] = useState(null);

  // -------------------------------- () to fetchRates from API backend --------------------------------
  function fetchRates(date, page = 1, append = false) {
    // are we appending? false mean this is first batch
    if (!append) {
      setLoading(true);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    // Clear any previous errors
    setError(null);

    // now do the fetching via API call
    const formattedDate = dayjs(date).format('YYYYMMDD'); // format date as per API spec
    fetch(`http://localhost:8000/api/rates/${formattedDate}?page=${page}&limit=12`)
      .then(response => response.json())
      .then(data => {
        const newRates = data.rates.map(item => ({
          title: item.currency,
          content: item.rate
        }));

        if (append) {
          setForexData(prev => [...prev, ...newRates]);
        } else {
          setForexData(newRates);
        }

        setToday(dayjs(data.effective_date).format('DD-MM-YYYY')); // set UI to use selected date
        setHasMore(data.pagination.has_more);
        setCurrentPage(page);
        setLoading(false);
        setLoadingMore(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(`Failed to fetch exchange rates. Error: ${error}`);
        setLoading(false);
        setLoadingMore(false);
      });
  }

  // () to load more items from backend
  function loadMore() {
    const nextPage = currentPage + 1;
    fetchRates(selectedDate, nextPage, true);
  }

  // -------------------------------- React useEffect on Load --------------------------------
  useEffect(() => {
    // Fetch **available dates** via API call
    fetch(`http://localhost:8000/api/rates/availableDates`)
      .then(response => response.json())
      .then(data => {
        // Dates are already in YYYYMMDD format from backend
        setAvailableDates(data.dates);
      })
      .catch(error => {
        console.error('Error fetching available dates:', error);
        setError(`Failed to fetch available dates. Some features may not work properly. Error: ${error}`);
      });

    // Fetch today's rates
    fetchRates(dayjs());
  }, []);

  // -------------------------------- Handle noRates state based on data --------------------------------
  useEffect(() => {
    if (!loading) {
      const filteredData = forexData.filter(item => item.content !== null);
      setNoRates(filteredData.length === 0);
    }
  }, [loading, forexData]);

  // -------------------------------- Handle input when user change date --------------------------------
  function datePickerOnChange(date, dateString) {
    setSelectedDate(date);
    fetchRates(date);
  }

  // -------------------------------- Render --------------------------------
  return (
    <Layout>
      {/* App Bar */}
      <Header style={{ backgroundColor: '#303030' }}>
        <AppBar />
      </Header>
      <Content style={{ minHeight: 'calc(100vh - 64px)', overflow: 'hidden', padding: '16px' }}>
        {/* Show datepicker*/}
        <Flex justify='space-between' align='center'>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Rates as of {today}</span>
          <DatePicker
            onChange={datePickerOnChange}
            value={selectedDate}
            cellRender={current => {
              const formatted = current.format('YYYYMMDD');
              const isAvailable = availableDates.includes(formatted);
              const isSelected = selectedDate && current.isSame(selectedDate, 'day');
              return (
                <div
                  style={{
                    border: isAvailable ? '2px solid #52c41a' : undefined,
                    backgroundColor: isSelected ? '#1890ff' : undefined,
                    color: isSelected ? 'white' : undefined,
                    borderRadius: '10px',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {current.date()}
                </div>
              );
            }}
          />
        </Flex>

        {/* Error Alert */}
        {/* shows up on Error */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginTop: 16 }}
          />
        )}

        {/* No rates Alert */}
        {/* shows up when 0 rates at selected date */}
        {noRates && (
          <Alert
            message="No rates at this date"
            description="Select another date from the picker at the top right. A date with a green border indicates a rate is recorded."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {/* List of currencies and their rates */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {
            (() => {
              // Show skeleton as content loads
              if (loading) {
                return Array.from({ length: 12 }).map((_, idx) => (
                  <Col xs={8} sm={6} md={5} lg={4} xl={3} key={idx}>
                    <ForexItem skeleton={true} />
                  </Col>
                ));
              }
              const filteredData = forexData.filter(item => item.content !== null);
              if (filteredData.length > 0) {
                return filteredData.map((item, idx) => (
                  <Col xs={8} sm={6} md={5} lg={4} xl={3} key={item?.id || idx}>
                    <ForexItem title={item.title} content={item.content} />
                  </Col>
                ));
              }
              return null;
            })()
          }
        </Row>

        {/* Load More Button */}
        {!loading && forexData.filter(item => item.content !== null).length > 0 && hasMore && (
          <Flex justify="center" style={{ marginTop: 24 }}>
            <Button
              type="primary"
              loading={loadingMore}
              onClick={loadMore}
              size="large"
            >
              Load More
            </Button>
          </Flex>
        )}
      </Content>
    </Layout>
  );
}

export default App;
