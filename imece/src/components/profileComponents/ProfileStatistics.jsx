import StatisticCard from "./StatisticCard";
import { useState, useEffect } from "react";
import axios from "axios"; // API çağrısı için axios kullanıyoruz.

//db.json dosyasından fake api verileri alınıp test edilebilir. npx json-server --watch db.json --port 3001

export default function ProfileStatistics() {
    // API'den alınacak verileri depolamak için state
    const [statData, setStatData] = useState({
        postViews: 0,
        followers: 0,
        searchViews: 0,
        profileViews: 0,
    });

    // API'den veri çekme işlemi
    useEffect(() => {
        // API çağrısı yapılacak URL
        axios.get("http://localhost:3001/statistics")
            .then(response => {
                // API yanıtından gelen verilerle statData'yı güncelle
                setStatData(response.data[0]); 
            })
            .catch(error => {
                console.error("API çağrısı sırasında hata oluştu:", error);
            });
    }, []); 

   
    const stats = [
        {
            key: "postViews",
            label: "Gönderi görünüm sayısı",
            current: 68,
            monthly: 146
        },
        {
            key: "followers",
            label: "Takipçiler",
            current: 10,
            monthly: 5
        },
        {
            key: "profileViews",
            label: "90 gün içinde profil görüntülenme sayısı",
            current: 15,
            monthly: 30
        },
        {
            key: "searchViews",
            label: "Aramada görünme sayısı",
            current: 25,
            monthly: 35
        }
    ];

    return (
   
        <div className="max-w-[1580px] min-w-[428px]  mt-15 mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 font-primary ">

            <h2 className="text-[15px] md:text-[20px] lg:text-[32px]  font-extrabold lg:font-bold text-[#1C274C] ml-5 my-3 ">Profil istatistikleri</h2>
            <div className="grid grid-cols-2 gap-4 m-5 -mt-1  ">
            {Object.keys(statData).length === 0 ? (
                <div>Yükleniyor...</div>
            ) : (
                stats.map((stat) => (
                    <StatisticCard
                        key={stat.key}
                        label={stat.label}
                        current={stat.current}
                        monthly={stat.monthly}
                        value={statData[stat.key]} 
                    />
                ))
            )}
            </div>
          
        </div>
    );
}
