import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";
import { todoSchema, type Todo, type TodoInput } from "./schemas/todo.schema";
import Spinner from "./components/Spinner";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [todoId, setTodoId] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const createForm = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit: SubmitHandler<TodoInput> = async (data) => {
    const todo: Todo = todoSchema.parse(data);
    setTodos((prev) => [...prev, todo]);
    createForm.reset();
  };

  const onEdit = (todo: Todo) => {
    setIsUpdating(true);
    setSelectedTodo(todo);
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen gap-4 p-3">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 border p-8 rounded-lg shadow-md w-full h-full md:w-3/4 lg:w-1/2 xl:w-1/3">
        <h1 className="text-2xl font-bold text-neutral-800 mb-5">
          React + Vite Todo App
        </h1>

        <div
          className={`flex flex-col items-center justify-between w-md gap-3 h-[80vh]`}
        >
          <div
            className={`flex flex-col items-center ${
              todos.length === 0
                ? "justify-center"
                : todos.length !== 0
                ? "justify-start p-1 overflow-y-auto h-[80vh]"
                : "justify-start"
            } w-md h-full`}
          >
            {todos.length === 0 && <p>No todos yet!</p>}

            {todos.map((todo) => (
              <Card key={todo.id} className="w-full mb-4">
                <CardHeader>
                  <CardTitle>{todo.title}</CardTitle>
                  <CardDescription>
                    {dayjs(todo.dateCreated).format("MM/DD/YYYY")}
                  </CardDescription>
                  <CardAction>
                    <Button onClick={() => onEdit(todo)} disabled={isUpdating}>
                      Edit
                    </Button>
                    <Button
                      disabled={isUpdating}
                      variant="destructive"
                      onClick={() =>
                        setTodos((prev) =>
                          prev.filter((item) => item.id !== todo.id)
                        )
                      }
                    >
                      Delete
                    </Button>
                  </CardAction>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onSubmit)}
              className="w-full flex items-center justify-between gap-2"
            >
              <fieldset
                className="flex flex-col gap-3 w-full"
                disabled={isUpdating}
              >
                <div className="w-full flex flex-col gap-2">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => {
                      const hasError = !!createForm.formState.errors.title;

                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder={
                                hasError
                                  ? createForm.formState.errors.title?.message
                                  : "Todo Title"
                              }
                              className={`w-full p-2 ${
                                hasError
                                  ? "text-red-600 placeholder:text-red-500 border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </fieldset>
              <Button
                variant="default"
                type="submit"
                disabled={createForm.formState.isSubmitting}
              >
                {createForm.formState.isSubmitting ? (
                  <>
                    <Spinner />
                    <span className="sr-only">Loading...</span>
                    Loading
                  </>
                ) : (
                  "Add Todo"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default App;
