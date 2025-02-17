import React from 'react';

interface Props {
  completedTasks: string[];
  onCompleteTask: (taskId: string, reward: number) => void;
}

const Tasks: React.FC<Props> = ({ completedTasks, onCompleteTask }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span>Visit my work</span>
            <button
              onClick={() => {
                window.open('example.com', '_blank');
                onCompleteTask('visit_work', 10);
              }}
              disabled={completedTasks.includes('visit_work')}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              +$10
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span>Watch advertisement</span>
            <button
              onClick={() => onCompleteTask('watch_ad', 20)}
              disabled={completedTasks.includes('watch_ad')}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              +$20
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;