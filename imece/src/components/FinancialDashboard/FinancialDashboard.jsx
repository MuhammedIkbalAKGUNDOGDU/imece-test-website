import Payments from "./Payments";

export default function FinancialDashboard() {
  return (
    <>
      <div className="max-w-2xl p-4 font-sans">
        {/* Balance Section */}
        <div className="mb-6">
          <h2 className="text-md sm:text-lg font-medium mb-4">Yatacak Bakiye</h2>
          <div className="flex border border-green-500 rounded-md w-full p-2">
            <p className="text-sm sm:text-base">Cüzdandaki Para Miktarı:</p>
            <p className="pl-3 text-green-500 text-sm sm:text-base">2453554.01</p>
          </div>
        </div>

        {/* Past Payments Section */}
        <Payments />

        {/* Sales Data Section */}
        <div className="mb-6">
          <h2 className="text-md sm:text-lg font-medium mb-4">Satış Verileri</h2>
          <div className="flex border border-gray-400 rounded-md w-full p-0.5 justify-around">
            <div className="px-2 py-1 text-sm sm:text-base">Günlük: 539,67 TL</div>
            <div className="text-gray-500 text-sm sm:text-base">/</div>
            <div className="px-2 py-1 text-sm sm:text-base">Aylık: 25.749,45 TL</div>
            <div className="text-gray-500 text-sm sm:text-base">/</div>
            <div className="px-2 py-1 text-sm sm:text-base">Yıllık: 565.549,98 TL</div>
          </div>
        </div>

        {/* Stock Product Performance Section */}
        <div className="mb-6">
          <h2 className="text-md sm:text-lg font-medium mb-4">Stok Ürün Ve Ürün Performansı</h2>
          <div className="flex gap-4 mt-4 items-start">
            <div className="flex flex-col items-center mt-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-lg font-bold">2</div>
              <div className="bg-gray-300 w-20 h-20 flex items-center justify-center mb-1 rounded-2xl"></div>
              <div className="text-xs sm:text-sm font-medium">Mandalina</div>
              <div className="text-xs sm:text-sm text-gray-500">14.000 ton</div>
            </div>

            <div className="flex flex-col items-center mt-4 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 flex items-center justify-center text-lg font-bold">1</div>
              <div className="bg-gray-300 w-20 h-20 flex items-center justify-center mb-1 rounded-2xl"></div>
              <div className="text-xs sm:text-sm font-medium">Portakal</div>
              <div className="text-xs sm:text-sm text-gray-500">28.750 ton</div>
            </div>

            <div className="flex flex-col items-center mt-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-lg font-bold">3</div>
              <div className="bg-gray-300 w-20 h-20 flex items-center justify-center mb-1 rounded-2xl"></div>
              <div className="text-xs sm:text-sm font-medium">Elma</div>
              <div className="text-xs sm:text-sm text-gray-500">4.500 ton</div>
            </div>
          </div>
        </div>

        {/* Bazı İstatistikler */}
        <div className="mb-6">
          <h2 className="text-md sm:text-lg font-medium mb-4">Bazı İstatikler</h2>
          <div className="text-sm sm:text-base text-gray-500 ">
            <p >En fazla beğenilen ürün: <span className="font-medium  ">Portakal</span></p>
            <p>En fazla beğeni sağlayan ürün: <span className="font-medium">Elma</span></p>
            <p>Ortalama aylık sepet tutarı: <span className="font-medium">34.743 TL</span></p>
          </div>
        </div>

        {/* Bölgesel Satış Verileri */}
        <div className="mb-6">
          <h2 className="text-md sm:text-lg font-medium mb-2">Bölgesel Satış Verileri</h2>
          <div className="space-y-1 text-sm sm:text-base">
            {[ 
              { city: "İstanbul", amount: "10.000 KG", profit: "120.000,78 TL" },
              { city: "Bursa", amount: "7.000 KG", profit: "104.000,78 TL" },
              { city: "Kocaeli", amount: "4.000 KG", profit: "120.000,78 TL" },
            ].map((data, index) => (
              <div key={index} className="flex justify-between max-w-100 border-b border-gray-500 text-gray-500 pb-2">
                <span>{data.city}: {data.amount}</span>
                <span className="text-green-500">Kazanç: {data.profit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sipariş Detayları */}
        <div className="mb-6">
          <h2 className="text-md sm:text-lg font-medium mb-2">Sipariş Detayları</h2>

          <div className="flex gap-2">
            <div className="text-sm sm:text-base">Toplam sipariş sayısı:</div>
            <div className="flex gap-8 border-b pb-2">
              <p className="text-sm sm:text-base">Günlük</p>
              <p className="text-sm sm:text-base">/</p>
              <p className="text-sm sm:text-base">Aylık</p>
              <p className="text-sm sm:text-base">/</p>
              <p className="text-sm sm:text-base">Yıllık</p>
            </div>
          </div>

          {/* KG Değerleri */}
          <div className="flex gap-14 pt-2 pl-38">
            <div className="flex flex-col items-center">
              <span className="text-sm sm:text-base">14 KG</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm sm:text-base">155 KG</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm sm:text-base">2555 KG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buton */}
      <div className="relative">
        <button className="md:absolute md:bottom-5 md:right-5 mb-5 ml-5 bg-green-500 hover:bg-green-600 text-white px-4 py-4 rounded">
          Satış verilerini görüntüle
        </button>
      </div>

    </>
  );
}
