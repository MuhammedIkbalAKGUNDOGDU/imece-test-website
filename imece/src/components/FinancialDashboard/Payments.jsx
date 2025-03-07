import React, { useState, useEffect } from 'react';

const Payments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetch('/payments.json') 
      .then((response) => response.json())
      .then((data) => setPaymentsData(data))
      .catch((error) => console.error('Veri çekme hatası:', error));
  }, []);

  const showMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 3, paymentsData.length));
  };

  const showLess = () => {
    setVisibleCount(4);
  };

  return (
    <div>
      <h2 className="text-sm md:text-lg font-medium mb-4">Ödeme Geçmişi</h2>
      <ul>
        {paymentsData.slice(0, visibleCount).map((payment, index, arr) => (
          <li className="mb-3" key={payment.id}>
            <span className={`text-sm md:text-base border-b border-gray-500 text-gray-500 pb-1 ${index === arr.length - 1 ? 'border-b-0' : ''}`}>
               tarihinde yatırılan tutar: {payment.amount.toFixed(2)} TL
            </span>
          </li>
        ))}
      </ul>

      {visibleCount < paymentsData.length && (
        <button className="text-sm md:text-md text-green-400 mb-2" onClick={showMore}>Daha Fazla Göster</button>
      )}
      {visibleCount > 4 && (
        <button className="text-sm md:text-md text-green-400 mb-2" onClick={showLess}>Daha Az Göster</button>
      )}
    </div>
  );
};

export default Payments;
