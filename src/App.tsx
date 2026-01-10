import { useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

type TodoTypes = {
  id: number;
  text: string;
  status: "completed" | "pending" | "in-progress";
  dateCreated?: Date;
};

function App() {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [todos, setTodos] = useState<TodoTypes[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const updateInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTodo = () => {
    if (inputValue) {
      const newTodo: TodoTypes = {
        id: Date.now(),
        text: inputValue,
        status: "pending",
        dateCreated: new Date(),
      };
      setTodos([...todos, newTodo]);
    } else {
      alert("Please enter a todo");
    }
    setInputValue("");
  };

  const updateTodo = (id: number, updatedFields: Partial<TodoTypes>) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedFields } : todo
      )
    );
  };

  const onCompleteTodo = (id: number) => {
    updateTodo(id, { status: "completed" });
  };

  const onOpenModal = (todoId: number) => {
    setSelectedTodoId(todoId);
    setModalOpen(true);
    const todo = todos.find((t) => t.id === todoId);
    if (todo && updateInputRef.current) {
      updateInputRef.current.value = todo.text;
    }
  };

  const onCloseModal = () => {
    setModalOpen(false);
    setSelectedTodoId(null);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 h-screen">
      <div className="flex flex-col items-center justify-center gap-4 w-lg">
        <h1>REACT TODO APP</h1>
        {todos.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <p>No todos available. Please add some tasks.</p>
          </div>
        )}
        <div className="flex flex-col items-start w-full overflow-y-auto h-96 gap-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between w-full p-3 border rounded cursor-pointer"
              onClick={() =>
                todo.status !== "completed" && onOpenModal(todo.id)
              }
            >
              <span
                className={todo.status === "completed" ? "line-through" : ""}
              >
                {todo.text}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteTodo(todo.id);
                }}
                disabled={todo.status === "completed"}
              >
                {todo.status === "completed" ? "Completed" : "Complete"}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <form className="form-container" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          placeholder="Enter todo"
          value={inputValue}
          onChange={(value) => handleInputChange(value)}
        />
        <Button onClick={addTodo} type="submit">
          Add
        </Button>
      </form>
      {/* {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={onCloseModal}>Close Modal</button>
            <form
              className="update-form-container"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Update todo"
                ref={updateInputRef}
              />
              <button
                onClick={() => {
                  if (updateInputRef.current) {
                    if (selectedTodoId) {
                      updateTodo(selectedTodoId, {
                        text: updateInputRef.current.value,
                      });
                      updateInputRef.current.value = "";
                      onCloseModal();
                    }
                  }
                }}
                type="submit"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )} */}
    </section>
  );
}

export default App;
