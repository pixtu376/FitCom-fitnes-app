import { Sidebar } from '../../widgets/Sidebar/Sidebar';
import { Card } from '../../shared/ui/Card/Card';
import { CalendarWidget } from '../../widgets/Calendar/CalendarWidget';
import { WeightChart } from '../../widgets/Analytics/WeightChart';
import { NutritionMemo } from '../../widgets/Nutrition/NutritionMemo';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#1A1D21] p-8 flex justify-center items-start font-sans">
      <div className="w-[1460px] grid grid-cols-[209px_1fr] gap-6">
        <Sidebar activeId="main" />
        
        <main className="grid grid-cols-[370px_1fr] gap-6">
          <div className="space-y-6">
            <Card 
              title="Январь" 
              extra={<div className="flex space-x-4 text-white"><span>{"<"}</span><span>{">"}</span></div>}
              className="h-[309px]"
            >
              <CalendarWidget />
            </Card>
            
            <Card 
              title="Аналитика" 
              extra={<div className="flex items-center text-white"><span className="mr-2 text-sm text-gray-400 font-normal">Вес</span> <span>{"<"}</span><span className="ml-2">{">"}</span></div>}
              className="h-[315px]"
            >
              <WeightChart />
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Ближайшая тренировка:" className="h-[408px]">
              <div className="text-[#4ADE80] text-xl mb-6">Через 2 дня <span className="font-bold">День ног</span></div>
              <ul className="space-y-4 text-white">
                {[
                  { n: "1. Приседания со штангой", v: "4×8", w: "80кг" },
                  { n: "2. Жим ногами в тренажере", v: "4×8", w: "80кг" },
                  { n: "3. Выпады", v: "4×8", w: "" },
                  { n: "4. Румынская тяга", v: "4×8", w: "" },
                  { n: "5. Разгибания ног в тренажере сидя", v: "4×8", w: "" },
                ].map((ex, i) => (
                  <li key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-1 rounded">
                    <span>{ex.n}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-emerald-400">+</span>
                      <span className="bg-[#2D3139] px-2 py-1 rounded text-xs min-w-[40px] text-center">{ex.v}</span>
                      <span className="bg-[#2D3139] px-2 py-1 rounded text-xs min-w-[50px] text-center">{ex.w}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Памятка питания" extra={<span className="text-xs text-gray-400">1850 / 2500 Ккал</span>} className="h-[222px]">
              <NutritionMemo />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};