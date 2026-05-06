const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const fs = require("fs").promises;
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SCENARIOS_FILE = path.join(DATA_DIR, "scenarios.json");
const SIMULATIONS_FILE = path.join(DATA_DIR, "simulations.json");

async function initDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(USERS_FILE);
    } catch {
      const defaultAdminPassword = await bcrypt.hash("admin123", 10);
      await fs.writeFile(
        USERS_FILE,
        JSON.stringify(
          [
            {
              id: 1,
              firstName: "Администратор",
              lastName: "Системы",
              email: "admin@okuyim.com",
              password: defaultAdminPassword,
              role: "admin",
              createdAt: new Date().toISOString(),
              isBlocked: false,
              stats: {
                totalSimulations: 0,
                completedSimulations: 0,
                averageScore: 0,
                totalDaysSpent: 0,
              },
            },
          ],
          null,
          2
        )
      );
    }

    try {
      await fs.access(SCENARIOS_FILE);
    } catch {// ===================== КЕЙС 1 =====================
      const scenario1 = {
        id: 1,
        name: "Разработка корпоративного сайта",
        difficulty: "средний",
        description:
          "Вам предстоит управлять командой разработки для создания корпоративного сайта компании. Необходимо уложиться в бюджет и сроки, обеспечив высокое качество.",
        budget: 100000,
        duration: 30,
        tasks: [
          {
            id: 1,
            startDay: 1,
            endDay: 3,
            dailyProgress: 20,
            dependencies: [],
            priority: "high",
          },
          {
            id: 2,            startDay: 2,
            endDay: 7,
            dailyProgress: 15,
            dependencies: [1],
            priority: "medium",
          },
          {
            id: 3,

            startDay: 4,
            endDay: 12,
            dailyProgress: 10,
            dependencies: [2],
            priority: "high",
          },
          {
            id: 4,
            startDay: 5,
            endDay: 20,
            dailyProgress: 6,
            dependencies: [2],
            priority: "high",
          },
          {
            id: 5,
            startDay: 10,
            endDay: 18,
            dailyProgress: 10,
            dependencies: [4],
            priority: "medium",
          },
          {
            id: 6,

            startDay: 18,
            endDay: 25,
            dailyProgress: 12,
            dependencies: [3, 4, 5],
            priority: "high",
          },
          {
            id: 7,
            startDay: 20,
            endDay: 26,
            dailyProgress: 15,
            dependencies: [3],
            priority: "low",
          },
          {
            id: 8,
            startDay: 22,
            endDay: 27,
            dailyProgress: 15,
            dependencies: [6],
            priority: "medium",
          },
          {
            id: 9,            startDay: 26,
            endDay: 29,
            dailyProgress: 20,
            dependencies: [6, 7, 8],
            priority: "high",
          },
          {id: 10,
            name: "Запуск и мониторинг",
            startDay: 29,
            endDay: 30,
            dailyProgress: 50,
            dependencies: [9],
            priority: "high",
          },
        ],
        resources: [
          {
            id: 1,
            name: "Анна",
            role: "Project Manager",
            efficiency: 1.2,
            costPerDay: 5000,
          },
          {
            id: 2,
            name: "Иван",
            role: "Разработчик",
            efficiency: 1.0,
            costPerDay: 4000,
          },
          {
            id: 3,
            name: "Мария",
            role: "Дизайнер",
            efficiency: 1.1,
            costPerDay: 4500,
          },
          {
            id: 4,
            name: "Петр",
            role: "Тестировщик",
            efficiency: 0.9,
            costPerDay: 3500,
          },
          {
            id: 5,
            name: "Елена",
            role: "Контент-менеджер",
            efficiency: 1.0,
            costPerDay: 3800,
          },
        ],
        risks: [
          {
            id: 1,
            name: "Задержка сервера",
            probability: 30,
            type: "time",
            severity: 2,
            description: "Проблемы с хостингом могут задержать разработку",
          },
          {
            id: 2,
            name: "Перегорание разработчика",
            probability: 25,
            type: "quality",
            severity: 15,
            description: "Высокая нагрузка может снизить качество кода",
          },
          {
            id: 3,
            name: "Изменение требований",
            probability: 40,
            type: "time",
            severity: 3,
            description: "Заказчик может запросить новые функции",
          },
          {
            id: 4,
            name: "Бюджетные риски",
            probability: 20,
            type: "budget",
            severity: 15,
            description: "Непредвиденные расходы могут превысить бюджет",
          },
          {
            id: 5,
            name: "Низкая мотивация команды",
            probability: 35,
            type: "satisfaction",
            severity: 10,
            description: "Снижение удовлетворенности может повлиять на скорость",
          },
        ],
        createdAt: new Date().toISOString(),
      };
// ===================== КЕЙС 2 =====================
      const scenario2 = {
        id: 2,
        name: "Приложение для доставки еды",
        difficulty: "сложный",
        description:
          "Вы руководите проектом по созданию мобильного приложения для доставки еды. Сжатые сроки, ограниченный бюджет и высокая конкуренция — проверьте свои навыки управления в сложных условиях.",
        budget: 250000,
        duration: 45,
        tasks: [
          {
            id: 1,            startDay: 1,
            endDay: 4,
            dailyProgress: 18,
            dependencies: [],
            priority: "high",
          },{
            id: 2,
            name: "UX/UI дизайн",
            startDay: 2,
            endDay: 6,
            dailyProgress: 16,
            dependencies: [1],
            priority: "high",
          },
          {
            id: 3,
            startDay: 5,
            endDay: 9,
            dailyProgress: 14,
            dependencies: [2],
            priority: "high",
          },
          {
            id: 4,
            startDay: 6,
            endDay: 14,
            dailyProgress: 9,
            dependencies: [2],
            priority: "medium",
          },
          {
            id: 5,            startDay: 8,
            endDay: 22,
            dailyProgress: 5,
            dependencies: [3],
            priority: "high",
        },
          {
            id: 6,
            name: "Разработка iOS приложения",
            startDay: 12,
            endDay: 30,
            dailyProgress: 5,
            dependencies: [4, 3],
            priority: "high",
          },
          {
            id: 7,
            name: "Разработка Android приложения",
            startDay: 12,
            endDay: 32,
            dailyProgress: 5,
            dependencies: [4, 3],
            priority: "high",
          },
          {
            id: 8,

            startDay: 20,
            endDay: 28,
            dailyProgress: 9,
            dependencies: [5],
            priority: "high",
          },
          {
            id: 9,
            startDay: 22,
            endDay: 30,
            dailyProgress: 9,
            dependencies: [5],
            priority: "medium",
          },
          {
            id: 10,
            startDay: 28,
            endDay: 38,
            dailyProgress: 8,
            dependencies: [6, 7, 8, 9],
            priority: "high",
          },
          {
            id: 11,
            startDay: 34,
            endDay: 40,
            dailyProgress: 10,
            dependencies: [10],
            priority: "high",
          },
          {
            id: 12,            startDay: 40,
            endDay: 43,
            dailyProgress: 25,
            dependencies: [11],
            priority: "high",
          },
          {
            id: 13,
            startDay: 42,
            endDay: 45,
            dailyProgress: 30,
            dependencies: [12],
            priority: "medium",
          },
        ],
        resources: [
          {
            id: 1,
            name: "Дмитрий",
            role: "Tech Lead",
            efficiency: 1.3,
            costPerDay: 8000,
          },
          {
            id: 2,
            name: "Алиса",
            role: "iOS-разработчик",
            efficiency: 1.1,
            costPerDay: 7000,
          },
          {
            id: 3,
            name: "Руслан",
            role: "Android-разработчик",
            efficiency: 1.0,
            costPerDay: 6500,
          },
          {
            id: 4,
            name: "Светлана",
            role: "Backend-разработчик",
            efficiency: 1.2,
            costPerDay: 7500,
          },
          {
            id: 5,
            name: "Камила",
            role: "UX/UI дизайнер",
            efficiency: 1.1,
            costPerDay: 5500,
          },
          {
            id: 6,
            name: "Тимур",
            role: "QA-инженер",
            efficiency: 0.95,
            costPerDay: 5000,
          },
          {
            id: 7,
            name: "Нурлан",
            role: "Project Manager",
            efficiency: 1.15,
            costPerDay: 6000,
          },
        ],
        risks: [
          {
            id: 1,
            name: "Отказ стороннего API",
            probability: 35,
            type: "time",
            severity: 4,
            description: "Платежная система или API карт могут быть недоступны",
          },
          {
            id: 2,
            name: "Отклонение приложения магазином",
            probability: 25,
            type: "time",
            severity: 5,
            description:
              "App Store или Google Play могут отклонить приложение из-за несоответствия требованиям",
          },
          {
            id: 3,
            name: "Уход ключевого разработчика",
            probability: 20,
            type: "quality",
            severity: 20,
            description: "Потеря iOS или Android разработчика критична для проекта",
          },
          {
            id: 4,
            name: "Нарушение безопасности данных",
            probability: 15,
            type: "satisfaction",
            severity: 25,
            description:
              "Уязвимость в платежной системе может подорвать доверие пользователей",
          },
          {
            id: 5,
            name: "Технический долг",
            probability: 45,
            type: "quality",
            seveseverity: 12,
            description:
              "Поспешная разработка накапливает технический долг и снижает качество",
          },
          {
            id: 6,
            name: "Изменение требований заказчика",
            probability: 50,
            type: "time",
            severity: 3,
            description: "Заказчик может добавить новые функции в середине разработки",
          },
          {
            id: 7,
            name: "Превышение бюджета на инфраструктуру",
            probability: 30,
            type: "budget",
            severity: 12,
            description: "Серверные расходы могут превысить запланированные",
          },
        ],
        createdAt: new Date().toISOString(),
      };

      // ===================== КЕЙС 3 =====================
      const scenario3 = {
        id: 3,
        name: "Внедрение CRM-системы",
        difficulty: "лёгкий",
        description:
          "Ваша задача — внедрить готовую CRM-систему в компании среднего бизнеса. Требуется настройка, обучение сотрудников и миграция данных из старой системы. Идеальный кейс для начинающих менеджеров проектов.",
        budget: 60000,
        duration: 20,
        tasks: [
          {
            id: 1,
            startDay: 1,
            endDay: 3,
            dailyProgress: 25,
            dependencies: [],
            priority: "high",
          },
          {
            id: 2,
            startDay: 2,
            endDay: 4,
            dailyProgress: 25,
            dependencies: [1],
            priority: "high",
          },
          {
            id: 3,
            startDay: 4,
            endDay: 9,
            dailyProgress: 14,
            dependencies: [2],
            priority: "high",
          },
          {
            id: 4,
            startDay: 7,
            endDay: 12,
            dailyProgress: 13,
            dependencies: [3],
            priority: "high",
          },
          {
            id: 5,
            startDay: 8,
            endDay: 13,
            dailyProgress: 14,
            dependencies: [3],
            priority: "medium",
          },
          {
            id: 6,
            startDay: 10,
            endDay: 14,
            dailyProgress: 18,
            dependencies: [3],
            priority: "medium",
          },
          {
            id: 7,
            startDay: 13,
            endDay: 16,
            dailyProgress: 22,
            dependencies: [4, 5, 6],
            priority: "high",
          },
          {
            id: 8,
            startDay: 14,
            endDay: 17,
            dailyProgress: 22,
            dependencies: [6],
            priority: "medium",
          },
          {
            id: 9,
            startDay: 16,
            endDay: 19,
            dailyProgress: 25,
            dependencies: [7, 8],
            priority: "medium",
          },
          {
            id: 10,
            startDay: 19,
            endDay: 20,
            dailyProgress: 50,
            dependencies: [9],
            priority: "high",
          },
        ],
        resources: [
          {
            id: 1,
            name: "Ольга",
            role: "Project Manager",
            efficiency: 1.1,
            costPerDay: 4500,
          },
          {
            id: 2,
            name: "Артем",
            role: "Системный администратор",
            efficiency: 1.0,
            costPerDay: 4000,
          },
          {
            id: 3,
            name: "Зарина",
            role: "Бизнес-аналитик",
            efficiency: 1.2,
            costPerDay: 5000,
          },
          {
            id: 4,
            name: "Максим",
            role: "Специалист по обучению",
            efficiency: 1.0,
            costPerDay: 3500,
          },
          {
            id: 5,
            name: "Айгуль",
            role: "Data-инженер",
            efficiency: 1.05,
            costPerDay: 4200,
          },
        ],
        risks: [
          {
            id: 1,
            name: "Потеря данных при миграции",
            probability: 25,
            type: "quality",
            severity: 18,
            description:
              "Часть данных может быть повреждена или утеряна при переносе из старой системы",
          },
          {
            id: 2,
            name: "Сопротивление сотрудников изменениям",
            probability: 45,
            type: "satisfaction",
            severity: 12,
            description:
              "Персонал может отказываться принимать новую систему и саботировать внедрение",
          },
          {
            id: 3,
            name: "Несовместимость с телефонией",
            probability: 30,
            type: "time",
            severity: 3,
            description: "CRM может не поддерживать текущую IP-телефонию компании",
          },
          {
            id: 4,
            name: "Задержка поставки лицензий",
            probability: 20,
            type: "time",
            severity: 2,
            description: "Вендор может задержать предоставление лицензий и доступов",
          },
          {
            id: 5,
            name: "Превышение бюджета на лицензии",
            probability: 15,
            type: "budget",
            severity: 10,
            description:
              "Количество необходимых лицензий может оказаться больше запланированного",
          },
        ],
        createdAt: new Date().toISOString(),
      };

      await fs.writeFile(
        SCENARIOS_FILE,
        JSON.stringify([scenario1, scenario2, scenario3], null, 2)
      );
    }

    try {
      await fs.access(SIMULATIONS_FILE);
    } catch {
      await fs.writeFile(SIMULATIONS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Error initializing data files:", error);
  }
}

// -------------------- HELPER FUNCTIONS --------------------

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading users from ${USERS_FILE}:`, error);
    return []; // Возвращаем пустой массив в случае ошибки, чтобы приложение не падало
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readScenarios() {
  const data = await fs.readFile(SCENARIOS_FILE, "utf8");
  return JSON.parse(data);
}

async function writeScenarios(scenarios) {
  await fs.writeFile(SCENARIOS_FILE, JSON.stringify(scenarios, null, 2));
}

async function readSimulations() {
  const data = await fs.readFile(SIMULATIONS_FILE, "utf8");
  return JSON.parse(data);
}

async function writeSimulations(simulations) {
  await fs.writeFile(SIMULATIONS_FILE, JSON.stringify(simulations, null, 2));
}

async function getNextUserId() {
  const users = await readUsers();
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}

async function getNextScenarioId() {
  const scenarios = await readScenarios();
  return scenarios.length > 0
    ? Math.max(...scenarios.map((s) => s.id)) + 1
    : 1;
}

async function getNextSimulationId() {
  const simulations = await readSimulations();
  return simulations.length > 0
    ? Math.max(...simulations.map((s) => s.id)) + 1
    : 1;
}

function getDaysWord(days) {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "дней";
  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дня";
  return "дней";
}

// -------------------- RECOMMENDATIONS --------------------

function generateDetailedRecommendations(simulation, scenario) {
  const recommendations = [];
  const actions = simulation.userActions || {
    tasksAssigned: 0,
    priorityChanges: 0,
    daysSkipped: 0,
    risksMitigated: 0,
  };
  const metrics = simulation.finalMetrics || {};

  const totalDays = simulation.currentDay;
  const actionRatio =
    (actions.tasksAssigned + actions.priorityChanges) / Math.max(1, totalDays);

  if (actionRatio < 0.1 && totalDays > 3) {
    recommendations.push({
      type: "critical",      description:
        'Вы практически не управляли проектом! Вы просто нажимали "Следующий день" без назначения задач и управления приоритетами.',
      detailed: `
**Что пошло не так:**
- Вы не назначили ни одного исполнителя на задачи (${actions.tasksAssigned} из ${simulation.tasks?.length || 0} задач)
- Вы не меняли приоритеты задач
- Команда не получала указаний

**Как правильно управлять проектом:**
1. Назначайте задачи сразу при старте проекта
2. Ежедневно проверяйте прогресс
3. Меняйте приоритеты при необходимости
4. Реагируйте на возникающие риски
      `,
    });
  }

  if (
    actions.tasksAssigned === 0 &&
    simulation.tasks &&
    simulation.tasks.length > 0
  ) {
    recommendations.push({
      type: "critical",      description:
        "Вы не назначили ни одной задачи членам команды. Без назначенных исполнителей работа не двигается.",
      detailed: `
**Последствия:**
- Команда простаивала
- Прогресс задач оставался на нуле
- Бюджет тратился впустую

**Как исправить:**
- При старте проекта сразу откройте панель задач
- Для каждой задачи назначьте подходящего специалиста
- Учитывайте эффективность сотрудников
      `,
    });
  }

  if (actions.priorityChanges === 0 && totalDays > 5) {
    recommendations.push({
      type: "warning",
      description:
        "Приоритеты задач оставались неизменными на протяжении всего проекта.",
      detailed: `
**Почему это важно:**
- Критические задачи могут терять актуальность
- Зависимости между задачами требуют пересмотра расписания

**Рекомендация:** Каждые 3-5 дней пересматривайте список задач и повышайте приоритет тем, у которых приближается дедлайн или низкий прогресс.
      `,
    });
  }

  if (metrics.budgetVariance > 20) {
    recommendations.push({
      type: "warning",
      description: `Бюджет превышен на ${metrics.budgetVariance.toFixed(1)}%.`,
      detailed: `
**Причины превышения:**
- Не контролировались затраты на ресурсы
- Риски съели значительную часть бюджета

**Как избежать:**
1. Создайте резервный фонд (минимум 15% от бюджета)
2. Отслеживайте бюджет ежедневно
3. При приближении к лимиту приостановите дорогие задачи
      `,
    });
  } else if (metrics.budgetVariance < -10) {
    recommendations.push({
      type: "success",
      description: `Вы сэкономили ${Math.abs(metrics.budgetVariance).toFixed(1)}% бюджета.`,
      detailed: `
**Что вы сделали правильно:**
- Эффективно распределили ресурсы
- Минимизировали влияние рисков

**Совет:** Сэкономленные средства можно направить на повышение качества или премии команде.
      `,
    });
  }

  if (metrics.timeVariance > 30) {recommendations.push({
  type: "warning",
  title: "Серьёзное отставание от графика",
  description: `Проект занял на ${metrics.timeVariance.toFixed(1)}% больше времени.`,
  detailed: `
**Причины отставания:**
- Задачи стартовали позже из-за неэффективного распределения ресурсов.
- Непредвиденные риски вызвали задержки в реализации.

**Как улучшить:**
1. Используйте диаграмму Ганта для планирования.
2. Закладывайте буферные дни на случай форс-мажоров.
3. Ежедневно проверяйте критический путь
      `,
    });
  } else if (metrics.timeVariance < -10) {
    recommendations.push({
      type: "success",
      description: `Завершили проект на ${Math.abs(metrics.timeVariance).toFixed(1)}% быстрее срока.`,
      detailed: `
**Что способствовало успеху:**
- Четкое планирование
- Быстрая реакция на изменения

Попробуйте более сложный кейс для дальнейшего роста.
      `,
    });
  }

  if (metrics.finalSatisfaction < 50) {
    recommendations.push({
      type: "warning",
      description: `Удовлетворенность упала до ${metrics.finalSatisfaction}%.`,
      detailed: `
**Как повысить:**
1. Держите клиента в курсе прогресса
2. Сдавайте промежуточные результаты
3. Быстро реагируйте на замечания
      `,
    });
  } else if (metrics.finalSatisfaction > 85) {
    recommendations.push({
      type: "success",
      description: `Удовлетворенность составила ${metrics.finalSatisfaction}%.`,
      detailed: `
Отличный результат! Вы укладывались в сроки и бюджет, качественно выполняли задачи.

Попробуйте кейс с более агрессивными сроками.
      `,
    });
  }

  if (metrics.finalQuality < 60) {
    recommendations.push({
      type: "warning",
      description: `Качество выполнения составило ${metrics.finalQuality}%.`,
      detailed: `
**Как улучшить:**
1. Не перегружайте команду задачами с высоким приоритетом
2. Добавляйте время на тестирование
3. При снижении качества временно снизьте нагрузку
      `,
    });
  }

  if (
    simulation.occurredRisks &&
    simulation.occurredRisks.length > (scenario.risks?.length || 0) / 2
  ) {
    recommendations.push({
      type: "warning",
      description: `Наступило ${simulation.occurredRisks.length} из ${scenario.risks?.length || 0} возможных рисков.`,
      detailed: `
**Как управлять рисками:**
1. Изучите список рисков при старте проекта
2. Для рисков с вероятностью >30% продумайте план действий
3. Создайте резервы времени и бюджета
      `,
    });
  }

  const successfulActions = recommendations.filter(
    (r) => r.type === "success"
  ).length;
  const criticalActions = recommendations.filter(
    (r) => r.type === "critical"
  ).length;
  const warningActions = recommendations.filter(
    (r) => r.type === "warning"
  ).length;

  let summary = "";
  if (criticalActions > 0) {
    summary =
      "У вас есть критические ошибки в управлении. Обязательно изучите рекомендации выше. Начните с назначения задач и ежедневного контроля прогресса.";
  } else if (warningActions > 0 && successfulActions === 0) {
    summary =
      "Неплохая попытка, но есть куда расти. Сосредоточьтесь на управлении бюджетом и временем.";
  } else if (successfulActions >= 2) {
    summary =
      "Отличная работа! Для дальнейшего роста попробуйте кейс посложнее или установите себе дополнительные ограничения.";
  } else {
    summary =
      "Продолжайте практиковаться! Управление проектами — это навык, который приходит с опытом.";
  }

  return { recommendations, summary };
}

// -------------------- AUTH ROUTES --------------------

app.post("/api/auth/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const users = await readUsers();
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким email уже существует" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: await getNextUserId(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "student",
      createdAt: new Date().toISOString(),
      isBlocked: false,
      stats: {
        totalSimulations: 0,
        completedSimulations: 0,
        averageScore: 0,
        totalDaysSpent: 0,
      },
    };
    users.push(newUser);
    await writeUsers(users);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }
    if (user.isBlocked) {
      return res.status(401).json({ error: "Аккаунт заблокирован" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Неверный пароль" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// -------------------- SCENARIO ROUTES --------------------

app.get("/api/scenarios", async (req, res) => {
  try {
    const scenarios = await readScenarios();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки кейсов" });
  }
});

app.get("/api/scenarios/:id", async (req, res) => {
  try {
    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === parseInt(req.params.id));
    if (!scenario) {
      return res.status(404).json({ error: "Кейс не найден" });
    }
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки кейса" });
  }
});

app.post("/api/scenarios", async (req, res) => {
  try {
    const scenarios = await readScenarios();
    const newScenario = {
      id: await getNextScenarioId(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    scenarios.push(newScenario);
    await writeScenarios(scenarios);
    res.status(201).json(newScenario);
  } catch (error) {
    console.error("Error creating scenario:", error);
    res.status(500).json({ error: "Ошибка создания кейса" });
  }
});

app.put("/api/scenarios/:id", async (req, res) => {
  try {
    const scenarios = await readScenarios();
    const index = scenarios.findIndex((s) => s.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: "Кейс не найден" });
    }
    scenarios[index] = {
      ...scenarios[index],
      ...req.body,
      id: scenarios[index].id,
    };
    await writeScenarios(scenarios);
    res.json(scenarios[index]);
  } catch (error) {
    res.status(500).json({ error: "Ошибка обновления кейса" });
  }
});

app.delete("/api/scenarios/:id", async (req, res) => {
  try {
    const scenarios = await readScenarios();
    const filtered = scenarios.filter((s) => s.id !== parseInt(req.params.id));
    if (filtered.length === scenarios.length) {
      return res.status(404).json({ error: "Кейс не найден" });
    }
    await writeScenarios(filtered);
    res.json({ message: "Кейс удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления кейса" });
  }
});

// -------------------- SIMULATION ROUTES --------------------

app.post("/api/simulations", async (req, res) => {
  const { userId, scenarioId } = req.body;
  try {
    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: "Кейс не найден" });
    }
    const simulation = {
      id: await getNextSimulationId(),
      userId,
      scenarioId,
      status: "in_progress",
      currentDay: 1,
      budget: scenario.budget,
      initialBudget: scenario.budget,
      satisfaction: 100,
      quality: 100,
      completedTasks: [],
      tasks: scenario.tasks.map((task) => ({
        ...task,
        status: "pending",
        progress: 0,
        assignedTo: null,
        actualStartDay: null,
        actualEndDay: null,
        plannedStartDay: task.startDay,
        plannedEndDay: task.endDay,
        delay: 0,
        priorityChanges: 0,
      })),
      logs: [
        {
          day: 0,
          message: `Проект "${scenario.title}" запущен. Бюджет: ${scenario.budget.toLocaleString()} сом`,
          type: "info",
        },
      ],
      activeRisks: [],
      occurredRisks: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      userActions: {
        tasksAssigned: 0,
        priorityChanges: 0,
        daysSkipped: 0,
        risksMitigated: 0,
        lastActionDay: null,
      },
    };
    const simulations = await readSimulations();
    simulations.push(simulation);
    await writeSimulations(simulations);
    res.status(201).json(simulation);
  } catch (error) {
    console.error("Error creating simulation:", error);
    res.status(500).json({ error: "Ошибка создания симуляции" });
  }
});

app.get("/api/simulations/user/:userId", async (req, res) => {
  try {
    const simulations = await readSimulations();
    const userSimulations = simulations.filter(
      (s) => s.userId === parseInt(req.params.userId)
    );
    res.json(userSimulations);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки симуляций" });
  }
});

app.get("/api/simulations/:id", async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulation = simulations.find(
      (s) => s.id === parseInt(req.params.id)
    );
    if (!simulation) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки симуляции" });
  }
});

app.put("/api/simulations/:id/tasks/:taskId", async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulationIndex = simulations.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );
    if (simulationIndex === -1) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }
    const taskIndex = simulations[simulationIndex].tasks.findIndex(
      (t) => t.id === parseInt(req.params.taskId)
    );
    if (taskIndex === -1) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    const oldTask = simulations[simulationIndex].tasks[taskIndex];

    simulations[simulationIndex].tasks[taskIndex] = {
      ...oldTask,
      ...req.body,
    };

    if (req.body.assignedTo && !oldTask.assignedTo) {
      simulations[simulationIndex].userActions.tasksAssigned++;
      simulations[simulationIndex].userActions.lastActionDay =
        simulations[simulationIndex].currentDay;
    }

    if (req.body.priority && req.body.priority !== oldTask.priority) {
      simulations[simulationIndex].userActions.priorityChanges++;
      simulations[simulationIndex].tasks[taskIndex].priorityChanges =
        (oldTask.priorityChanges || 0) + 1;
      simulations[simulationIndex].userActions.lastActionDay =
        simulations[simulationIndex].currentDay;
    }

    simulations[simulationIndex].lastUpdatedAt = new Date().toISOString();
    await writeSimulations(simulations);
    res.json(simulations[simulationIndex].tasks[taskIndex]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Ошибка обновления задачи" });
  }
});

app.post("/api/simulations/:id/nextDay", async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulationIndex = simulations.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );
    if (simulationIndex === -1) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }

    const simulation = simulations[simulationIndex];
    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === simulation.scenarioId);

    if (simulation.status !== "in_progress") {
      return res.status(400).json({ error: "Симуляция уже завершена" });
    }

    const hadActionsToday =
      simulation.userActions.lastActionDay === simulation.currentDay;

    if (!hadActionsToday) {
      simulation.userActions.daysSkipped =
        (simulation.userActions.daysSkipped || 0) + 1;
    }

    simulation.currentDay++;
    simulation.userActions.lastActionDay = null;

    let anyTaskInProgress = false;
    simulation.tasks.forEach((task) => {
      if (task.status === "in_progress" && task.assignedTo) {
        anyTaskInProgress = true;
        const resource = scenario.resources.find(
          (r) => r.id === task.assignedTo
        );
        const efficiency = resource?.efficiency || 1;
        let dailyProgress = (task.dailyProgress || 10) * efficiency;
        if (task.priority === "high") {
          dailyProgress *= 1.2;
        }
        task.progress = Math.min(100, task.progress + dailyProgress);
        if (task.progress >= 100) {
          task.status = "completed";
          task.actualEndDay = simulation.currentDay;
          simulation.completedTasks.push(task.id);
          simulation.logs.push({
            day: simulation.currentDay,
            message: `Задача "${task.title}" завершена!`,
            type: "success",
          });
        }
      }
    });

    if (!anyTaskInProgress && simulation.currentDay > 1) {
      simulation.logs.push({
        day: simulation.currentDay,
        message: `Внимание: Нет активных задач! Назначьте задачи членам команды.`,
        type: "warning",
      });
    }

    scenario.risks.forEach((risk) => {
      if (
        !simulation.occurredRisks.some((r) => r.id === risk.id) &&
        Math.random() < risk.probability / 100
      ) {
        let effectMessage = "";

        if (risk.type === "budget") {
          const reduction = simulation.budget * (risk.severity / 100);
          simulation.budget = Math.max(0, simulation.budget - reduction);
          effectMessage = `Бюджет уменьшен на ${Math.round(reduction).toLocaleString()} сом`;
        } else if (risk.type === "time") {
          const delayDays = risk.severity;
          simulation.tasks.forEach((task) => {
            if (task.status === "in_progress") {
              task.delay += delayDays;
            }
          });
          effectMessage = `Задачи задержаны на ${delayDays} ${getDaysWord(delayDays)}`;
        } else if (risk.type === "satisfaction") {
          simulation.satisfaction = Math.max(
            0,
            simulation.satisfaction - risk.severity
          );
          effectMessage = `Удовлетворенность снижена на ${risk.severity}%`;
        } else if (risk.type === "quality") {
          simulation.quality = Math.max(
            0,
            simulation.quality - risk.severity
          );
          effectMessage = `Качество снижено на ${risk.severity}%`;
        }

        simulation.occurredRisks.push({
          ...risk,
          dayOccurred: simulation.currentDay,
          effect: effectMessage,
        });

        simulation.logs.push({
          day: simulation.currentDay,
          message: `РИСК: ${risk.name}. ${effectMessage}`,
          type: "risk",
        });
      }
    });

    const completedCount = simulation.tasks.filter(
      (t) => t.status === "completed"
    ).length;
    const totalTasks = simulation.tasks.length;
    const expectedProgress = simulation.currentDay / scenario.duration;
    const actualProgress = completedCount / totalTasks;

    let satisfactionChange = 0;
    if (actualProgress > expectedProgress + 0.1) {
      satisfactionChange = 5;
    } else if (actualProgress > expectedProgress) {
      satisfactionChange = 2;
    } else if (actualProgress < expectedProgress - 0.2) {
      satisfactionChange = -15;
    } else if (actualProgress < expectedProgress - 0.1) {
      satisfactionChange = -8;
    } else if (actualProgress < expectedProgress) {
      satisfactionChange = -3;
    }

    if (!hadActionsToday && simulation.currentDay > 2) {
      satisfactionChange -= 5;
      simulation.logs.push({
        day: simulation.currentDay,
        message: `Удовлетворенность снижена из-за отсутствия управления`,
        type: "warning",
      });
    }

    simulation.satisfaction = Math.min(
      100,
      Math.max(0, simulation.satisfaction + satisfactionChange)
    );

    let qualityChange = 0;
    const highPriorityTasks = simulation.tasks.filter(
      (t) => t.priority === "high" && t.status === "in_progress"
    ).length;
    if (highPriorityTasks > 3) {
      qualityChange = -5;
      simulation.logs.push({
        day: simulation.currentDay,
        message: `Слишком много задач с высоким приоритетом! Команда перегружена, качество падает.`,
        type: "warning",
      });
    }

    simulation.quality = Math.min(
      100,
      Math.max(0, simulation.quality + qualityChange)
    );

    const allCompleted = simulation.tasks.every(
      (t) => t.status === "completed"
    );
    const timeOver = simulation.currentDay > scenario.duration;

    if (allCompleted || timeOver) {
      simulation.status = "completed";
      simulation.completedAt = new Date().toISOString();

      const totalDelay = simulation.tasks.reduce(
        (sum, t) => sum + (t.delay || 0),
        0
      );
      const budgetUsed = simulation.initialBudget - simulation.budget;
      const budgetVariance =
        ((budgetUsed - scenario.budget) / scenario.budget) * 100;
      const timeVariance =
        ((simulation.currentDay - scenario.duration) / scenario.duration) * 100;

      simulation.finalMetrics = {
        totalDelay,
        budgetUsed,
        budgetVariance,
        timeVariance,
        finalSatisfaction: simulation.satisfaction,
        finalQuality: simulation.quality,
        completedTasksCount: simulation.completedTasks.length,
        totalTasksCount: totalTasks,
      };

      simulation.recommendations = generateDetailedRecommendations(
        simulation,
        scenario
      );

      const resultMessage = allCompleted
        ? `ПОЗДРАВЛЯЕМ! Проект успешно завершен за ${simulation.currentDay} ${getDaysWord(simulation.currentDay)}`
        : `Проект завершен с превышением срока. Срок: ${scenario.duration} ${getDaysWord(scenario.duration)}, фактически: ${simulation.currentDay} ${getDaysWord(simulation.currentDay)}`;

      simulation.logs.push({
        day: simulation.currentDay,
        message: resultMessage,
        type: "completed",
      });

      const users = await readUsers();
      const userIndex = users.findIndex((u) => u.id === simulation.userId);
      if (userIndex !== -1) {
        users[userIndex].stats.totalSimulations =
          (users[userIndex].stats.totalSimulations || 0) + 1;
        users[userIndex].stats.completedSimulations =
          (users[userIndex].stats.completedSimulations || 0) + 1;
        users[userIndex].stats.totalDaysSpent =
          (users[userIndex].stats.totalDaysSpent || 0) + simulation.currentDay;

        const score = Math.round(
          simulation.satisfaction * 0.4 +
            (100 - Math.min(100, Math.abs(budgetVariance))) * 0.3 +
            (100 - Math.min(100, Math.abs(timeVariance))) * 0.3
        );

        const prevCompleted = users[userIndex].stats.completedSimulations - 1;
        const currentTotal =
          (users[userIndex].stats.averageScore || 0) * prevCompleted;
        users[userIndex].stats.averageScore =
          (currentTotal + score) / users[userIndex].stats.completedSimulations;

        await writeUsers(users);
      }
    }

    simulation.lastUpdatedAt = new Date().toISOString();
    simulations[simulationIndex] = simulation;
    await writeSimulations(simulations);
    res.json(simulation);
  } catch (error) {
    console.error("Error advancing day:", error);
    res.status(500).json({ error: "Ошибка при переходе на следующий день" });
  }
});

app.post("/api/simulations/:id/complete", async (req, res) => {
  try {
    const simulations = await readSimulations();
    const simulationIndex = simulations.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );
    if (simulationIndex === -1) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }

    const sim = simulations[simulationIndex];
    sim.status = "completed";
    sim.completedAt = new Date().toISOString();
    sim.lastUpdatedAt = new Date().toISOString();

    const scenarios = await readScenarios();
    const scenario = scenarios.find((s) => s.id === sim.scenarioId);

    const totalTasks = sim.tasks.length;
    const completedCount = sim.completedTasks.length;
    const budgetUsed = sim.initialBudget - sim.budget;
    const budgetVariance =
      ((budgetUsed - scenario.budget) / scenario.budget) * 100;
    const timeVariance =
      ((sim.currentDay - scenario.duration) / scenario.duration) * 100;

    sim.finalMetrics = {
      totalDelay: sim.tasks.reduce((sum, t) => sum + (t.delay || 0), 0),
      budgetUsed,
      budgetVariance,
      timeVariance,
      finalSatisfaction: sim.satisfaction,
      finalQuality: sim.quality,
      completedTasksCount: completedCount,
      totalTasksCount: totalTasks,
    };

    sim.recommendations = generateDetailedRecommendations(sim, scenario);

    await writeSimulations(simulations);
    res.json(sim);
  } catch (error) {
    console.error("Error completing simulation:", error);
    res.status(500).json({ error: "Ошибка завершения симуляции" });
  }
});

app.delete("/api/simulations/:id", async (req, res) => {
  try {
    const simulations = await readSimulations();
    const filtered = simulations.filter(
      (s) => s.id !== parseInt(req.params.id)
    );
    if (filtered.length === simulations.length) {
      return res.status(404).json({ error: "Симуляция не найдена" });
    }
    await writeSimulations(filtered);
    res.json({ message: "Симуляция удалена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления симуляции" });
  }
});

// -------------------- ADMIN ROUTES --------------------

app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await readUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки пользователей" });
  }
});

app.put("/api/admin/users/:id/block", async (req, res) => {
  try {
    const users = await readUsers();
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    users[userIndex].isBlocked = !users[userIndex].isBlocked;
    await writeUsers(users);
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Ошибка изменения статуса пользователя" });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const users = await readUsers();
    const filtered = users.filter((u) => u.id !== parseInt(req.params.id));
    if (filtered.length === users.length) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    await writeUsers(filtered);
    res.json({ message: "Пользователь удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления пользователя" });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    const users = await readUsers();
    const simulations = await readSimulations();
    const scenarios = await readScenarios();

    const completedSimulations = simulations.filter(
      (s) => s.status === "completed"
    );

    const scenarioStats = scenarios.map((scenario) => {
      const scenarioSimulations = simulations.filter(
        (s) => s.scenarioId === scenario.id
      );
      const completedScenarios = scenarioSimulations.filter(
        (s) => s.status === "completed"
      );
      const avgScore =
        completedScenarios.length > 0
          ? completedScenarios.reduce(
              (sum, s) => sum + (s.finalMetrics?.finalSatisfaction || 0),
              0
            ) / completedScenarios.length
          : 0;
      return {
        id: scenario.id,

        difficulty: scenario.difficulty,
        attempts: scenarioSimulations.length,
        completedCount: completedScenarios.length,
        avgScore: Math.round(avgScore),
      };
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const dailyActivity = last7Days.map((date) => {
      const count = simulations.filter(
        (s) => s.startedAt && s.startedAt.split("T")[0] === date
      ).length;
      return { date, count };
    });

    const avgScoreAllTime =
      completedSimulations.length > 0
        ? completedSimulations.reduce((sum, s) => {
            const m = s.finalMetrics;
            if (!m) return sum;
            const score = Math.round(
              (m.finalSatisfaction || 0) * 0.4 +
                (100 - Math.min(100, Math.abs(m.budgetVariance || 0))) * 0.3 +
                (100 - Math.min(100, Math.abs(m.timeVariance || 0))) * 0.3
            );
            return sum + score;
          }, 0) / completedSimulations.length
        : 0;

    res.json({
      totalUsers: users.length,
      totalSimulations: simulations.length,
      completedSimulations: completedSimulations.length,
      averageScore: Math.round(avgScoreAllTime),
      scenarioStats,
      dailyActivity,
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки статистики" });
  }
});

// -------------------- START --------------------

initDataFiles()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Data directory: ${DATA_DIR}`);
      console.log(`Admin: admin@okuyim.com / admin123`);
    });
  })
  .catch(console.error);
