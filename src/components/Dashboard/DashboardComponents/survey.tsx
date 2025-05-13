"use client";

import { useTranslations } from 'next-intl';

const DashboardSurveys: React.FC<{ surveyData: any[] }> = ({ surveyData }) => {
  const t = useTranslations();
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        {t('SURVEY.table.title')}
      </h4>

      <div className="relative overflow-x-auto text-black">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">{t('SURVEY.table.surveyTitle')}</th>
              <th className="px-6 py-3">{t('SURVEY.table.assigned')}</th>
              <th className="px-6 py-3">{t('SURVEY.table.responded')}</th>
              <th className="px-6 py-3">{t('SURVEY.table.responseRate')}</th>
              <th className="px-6 py-3">{t('SURVEY.table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {surveyData?.length === 0 ? (
              <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                  {t('COMMON.noDataText')}
                </td>
              </tr>
            ) : (
              surveyData?.map((item, index) => (
                <tr key={index} className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-black dark:text-white">
                    {item.survey_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.total_assigned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.total_responded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.response_rate || 0}%
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap capitalize`}>
                    <div className={`px-6 py-2 rounded-full  ${item.survey_status == 'open' ? 'bg-green-500 w-fit text-white': 'bg-red text-white'}`}>
                    {item.survey_status}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardSurveys;
