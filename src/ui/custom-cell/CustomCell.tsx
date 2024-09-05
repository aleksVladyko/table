import styles from "./CustomCell.module.css";
interface CellProps {
    id: number;
    title: string;
    name: string;
    value: string | number;
    type: string;
    onChange: (id: number, value: string) => void;
}
const CustomCell: React.FC<CellProps> = ({ ...props }) => {
    const { id, title, name, value, type, onChange } = props;
    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        onChange(id, e.target.value);
    };
    return (
        <div className={styles.wrapper_cell_input}>
            {name === "master" && <span> {title} </span>}
            {name === "comment" ? (
                <textarea
                    className={styles.cell_textarea}
                    value={value}
                    onChange={handleChange}
                ></textarea>
            ) : (
                <input
                    className={styles.cell_input}
                    type={type === "percent" ? "text" : type}
                    value={value}
                    onChange={handleChange}
                    style={
                        name === "kptStatus"
                            ? { color: "red" }
                            : { color: "black" }
                    }
                />
            )}
        </div>
    );
};
export default CustomCell;
