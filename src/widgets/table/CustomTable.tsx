import Alert from "@mui/material/Alert";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import CustomSell from "../../ui/custom-cell/CustomCell";
import ProgressBar from "../../ui/progress-bar/ProgressBar";
import { mockData } from "../../utils/mock";
import styles from "./CustomTable.module.css";

const CustomTable = () => {
    const [updateValue, setUpdateValue] = useState<
        { id: number; value: string | number }[]
    >([]);
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
        null
    );
    const [progress, setProgress] = useState<number>(100); // Прогресс для прогресс-бара
    const [showProgress, setShowProgress] = useState<boolean>(false); // Флаг для отображения прогресса
    // Хук состояния для хранения идентификатора таймера,
    // который будет установлен при ожидании (например, ожидание перед отправкой данных).
    const [initialTimeout, setInitialTimeout] = useState<ReturnType<
        typeof setTimeout
    > | null>(null);
    // Хук состояния для хранения идентификатора интервала,
    // который будет использоваться для обновления прогресса отправки данных.
    const [progressInterval, setProgressInterval] = useState<ReturnType<
        typeof setInterval
    > | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false); // Состояние для контроля видимости Alert
    // Хук состояния для хранения измененных значений полученых при использовании useDebounce
    const [debouncedUpdateValue, setDebouncedUpdateValue] = useState<
        { id: number; value: string | number }[]
    >([]);
    const debouncedValues = useDebounce(debouncedUpdateValue, 2000);

    useEffect(() => {
        if (debouncedValues.length > 0) {
            setUpdateValue(debouncedValues);
            resetTimers();
        }
    }, [debouncedValues]);

    const formik = useFormik({
        initialValues: { cells: mockData },
        onSubmit: () => {
            console.log("Отправка измененных значений...", updateValue);
            setShowAlert(true); // Показываем Alert после успешной отправки
            setTimeout(() => {
                setShowAlert(false);
            }, 2000);
            // Здесь можно добавить логику отправки данных на сервер или сделать это через контекст или стм
        },
    });

    const handleInputChange = (id: number, value: string) => {
        const updatedCells = formik.values.cells.map((cell) => {
            if (cell.id === id) {
                let newValue;
                // Валидация в зависимости от типа ячейки
                if (cell.type === "number") {
                    newValue = value.replace(/[^0-9]/g, "");
                } else if (cell.type === "percent") {
                    const numberPart = value.replace(/[^0-9.]/g, "");
                    if ((numberPart.match(/\./g) || []).length <= 1) {
                        newValue = numberPart ? numberPart + "%" : "";
                    } else {
                        newValue = value.slice(0, -1);
                    }
                } else if (cell.title.includes("Мастер")) {
                    newValue = value.replace(/[^а-яА-ЯёЁ. ]/g, "");
                } else {
                    newValue = value;
                }

                return { ...cell, value: newValue }; // Обновляем значение
            }
            return cell;
        });

        formik.setFieldValue("cells", updatedCells); // Сохраняем обновленное состояние в форме
        const modifiedCells = updatedCells.filter(
            (cell, index) => cell.value !== mockData[index].value
        );
        setDebouncedUpdateValue(
            modifiedCells.map((cell) => ({
                id: cell.id,
                value: cell.value,
            }))
        );
    };

    const resetTimers = () => {
        clearTimers(); // Очистить предыдущие таймеры
        setProgress(100); // Сбросить прогресс до 100%
        setShowProgress(false); // Скрыть прогресс-бар
        // Запустить таймер на 5 секунд
        const timeout = setTimeout(() => {
            console.log("Запускаю таймер на отправку данных...");
            setShowProgress(true); // Показать прогресс-бара после 5 секунд
            // После 5 секунд запускаем таймер на 10 секунд
            const sendTimeout = setTimeout(() => {
                // Отправляем данные, когда таймер выполнится
                formik.handleSubmit();
            }, 10000); // 10 секунд

            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(progressInterval);
                        return 0;
                    }
                    return prev - 10; // Уменьшаем прогресс на 10% каждую секунду
                });
            }, 1000);
            setTimer(sendTimeout);
            setProgressInterval(progressInterval);
        }, 5000);

        setInitialTimeout(timeout);
    };

    const clearTimers = () => {
        if (timer) clearTimeout(timer);
        if (initialTimeout) clearTimeout(initialTimeout);
        if (progressInterval) clearInterval(progressInterval); // Очистить интервал прогресса
    };
    return (
        <>
            <section className={styles.custom_table_wrapper}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={styles.grid}>
                        {formik.values.cells.map((cell, i) => (
                            <div
                                className={`${styles.cell} ${
                                    styles[`cell-${i + 1}`]
                                }`} // Уникальные классы для каждой ячейки
                                key={cell.id}
                            >
                                <CustomSell
                                    id={cell.id}
                                    name={cell.name}
                                    title={cell.title}
                                    value={cell.value}
                                    type={cell.type}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </div>
                </form>
            </section>{" "}
            {showProgress && progress > 0 && (
                <ProgressBar progress={progress} />
            )}
            {showAlert && (
                <Alert
                    severity="success"
                    onClose={() => setShowAlert(false)}
                    style={{ marginTop: "20px" }}
                >
                    Изменения успешно сохранены!
                </Alert>
            )}
        </>
    );
};

export default CustomTable;
