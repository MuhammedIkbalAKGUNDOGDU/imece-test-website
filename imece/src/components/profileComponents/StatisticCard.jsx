//yüzdeler dinamik hale gelecek => Api tasarımı nasıl öğrenilmeli ona göre yapılabilir. 
export default function StatisticCard({ label, current, monthly, value }) {
  return (
    <div className="border-[3px] border-[#959DA5]/20 p-2 rounded-lg lg:flex justify-between  kanit">
      {/* değer ve açıklama */}
      <div className="lg:m-4">
        <div className="text-lg md:text-xl lg:text-[32px] font-semibold   text-black">{value}</div>
        <div className="text-sm md:text-lg lg:text-xl  font-light text-[#717171]">{label}</div>

      </div>
    
      {/* yüzdeler */}
      <div className="grid grid-cols-2 md:mr-50 lg:m-2 lg:mt-4 lg:mr-30">
        {/* haftalık yüzde */}
        <div className="text-sm md:text-md lg:text-xl font-normal text-[#717171]">Son 7 gün</div>
        <span className="text-sm md:text-md lg:text-xl font-light text-[#22FF22]">▲ {current}%</span>
        {/* aylık yüzde */}
        <div className="text-sm md:text-md lg:text-xl font-normal text-[#717171]">Son 1 ay</div>
        <span className="text-sm md:text-md lg:text-xl font-light text-[#22FF22]">▲ {monthly}%</span>
      </div>

    </div>
















  
  );
}
