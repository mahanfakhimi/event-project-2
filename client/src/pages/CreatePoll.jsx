// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router";
import { TextField, Button, IconButton, Alert, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useCreatePoll } from "../api/polls";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";

const createPollSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل 3 کاراکتر باشد"),
  description: z.string().min(10, "توضیحات باید حداقل 10 کاراکتر باشد"),
  endDate: z
    .date({
      required_error: "تاریخ پایان نمی‌تواند خالی باشد",
      invalid_type_error: "تاریخ نامعتبر است",
    })
    .min(new Date(), "تاریخ پایان باید بعد از امروز باشد"),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "گزینه نمی‌تواند خالی باشد"),
      })
    )
    .min(2, "حداقل 2 گزینه نیاز است"),
});

const CreatePoll = () => {
  const navigate = useNavigate();
  const { mutate: createPoll, isPending, error } = useCreatePoll();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.3,
    initial: true,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      endDate: undefined,
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const handleAddOption = () => {
    const newIndex = fields.length;

    append({ text: "" });

    setTimeout(() => {
      const newOption = document.querySelector(
        `[name="options.${newIndex}.text"]`
      );

      if (newOption) {
        newOption.scrollIntoView({ behavior: "smooth", block: "center" });
        newOption.focus();
      }
    }, 100);
  };

  const handleRemoveOption = (index) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const onSubmit = (data) => {
    createPoll(
      {
        title: data.title,
        description: data.description,
        endDate: data.endDate,
        options: data.options.map((opt) => ({ text: opt.text })),
      },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ delay: 0.2 }}
        className="shadow-sm rounded-sm p-4"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-2xl"
        >
          ایجاد نظرسنجی جدید
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            <Alert severity="error" className="mb-4">
              {error.message}
            </Alert>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TextField
              fullWidth
              label="عنوان نظرسنجی"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TextField
              fullWidth
              label="توضیحات"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ delay: 0.7 }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
              <DatePicker
                label="تاریخ پایان"
                value={watch("endDate")}
                onChange={(date) => setValue("endDate", date)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText:
                      errors.endDate?.message ||
                      "تاریخ پایان نمی‌تواند خالی باشد",
                    variant: "filled",
                  },
                }}
              />
            </LocalizationProvider>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-4 text-2xl"
            >
              گزینه‌ ها
            </motion.p>

            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ x: 50, opacity: 0, height: 0 }}
                animate={{ x: 0, opacity: 1, height: "auto" }}
                exit={{ x: -50, opacity: 0, height: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                  delay: index < 2 ? 0.8 + index * 0.2 : 0,
                }}
                className="flex items-center gap-2"
              >
                <TextField
                  fullWidth
                  label={`گزینه ${index + 1}`}
                  error={!!errors.options?.[index]?.text}
                  helperText={errors.options?.[index]?.text?.message}
                  {...register(`options.${index}.text`)}
                />
                {fields.length > 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.2,
                      delay: index < 2 ? 0.9 + index * 0.2 : 0,
                    }}
                    className="mr-2"
                  >
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveOption(index)}
                      className="self-end"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </motion.div>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                className="mt-2"
                fullWidth
                color="warning"
              >
                افزودن گزینه
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.3 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isPending}
              className="mt-6"
            >
              {isPending ? "در حال ایجاد..." : "ایجاد نظرسنجی"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatePoll;
