import styles from "./ProgressBar.module.css";
interface ProgressBarProps {
    progress: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ ...props }) => {
    const { progress } = props;
    const secondsRemaining = progress / 10;

    // Функция для получения слова "секунды" в зависимости от числа
    const getTimeWord = (num: number) => {
        if (num % 10 === 1 && num % 100 !== 11) {
            return "секунду";
        } else if (
            num % 10 >= 2 &&
            num % 10 <= 4 &&
            (num % 100 < 10 || num % 100 >= 20)
        ) {
            return "секунды";
        } else {
            return "секунд";
        }
    };
    return (
        <section className={styles.progress_bar_wrapper}>
            <span>
                Отправка данных через {secondsRemaining}{" "}
                {getTimeWord(secondsRemaining)}
            </span>
            <div className={styles.progress_bar}>
                <div
                    className={styles.fill}
                    style={{ width: `${100 - progress}%` }}
                />
            </div>
        </section>
    );
};
export default ProgressBar;
