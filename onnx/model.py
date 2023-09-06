from datasets import load_dataset, load_metric, Dataset
import transformers
from transformers import AutoTokenizer, PreTrainedTokenizer, AutoModelForSequenceClassification
from transformers import TrainingArguments, Trainer, EvalPrediction, PreTrainedModel
import transformers.convert_graph_to_onnx as onnx_convert
import torch
import numpy as np
from onnxruntime.quantization import quantize_dynamic, QuantType
import onnxruntime as ort
from pathlib import Path

MODEL_NAME = 'microsoft/xtremedistil-l6-h256-uncased'
MAX_LENGTH = 128
DEVICE = 'cuda:0' if torch.cuda.is_available() else 'cpu'
ONNX_MODEL_PATH = 'onnx_model.onnx'



class TrainEmotion():
	"""
	Train emotion model
	"""
	def __init__(self, model_name, max_length, device, onnx_model_path):
		self.model_name = model_name
		self.max_length = max_length
		self.device = device
		self.onnx_model_path = onnx_model_path
		self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
		self.dataset = load_dataset('emotion')
		self.metrics = load_metric("accuracy")
	
	def load_dataset(self) -> (Dataset, Dataset):
		"""
		Load dataset and tokenize and return train and test dataset
		"""
		tokenized_datasets = self.dataset.map(
			lambda data: self.tokenizer(data["text"], padding="max_length", max_length=self.max_length, truncation=True),
			batched=True)
		return tokenized_datasets["train"], tokenized_datasets["test"]
	
	def load_model(self):
		"""
		Load model and return model
		"""
		self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name, num_labels=6)
		self.model = self.model.to(self.device)
		return self.model


	def train(self, train_dset, test_dset):
		"""
		Train model and evaluate
		"""
		print("Training model...")
		training_args = TrainingArguments("test_trainer",
									per_device_train_batch_size=128,
									num_train_epochs=24,learning_rate=3e-05,
									evaluation_strategy="epoch"
									)
		trainer = Trainer(
			model=self.model,
			args=training_args,
			train_dataset=train_dset,
			eval_dataset=test_dset,
			compute_metrics=self.compute_metrics
			)
		trainer.train()
		trainer.evaluate()
		return
	

	def export_onnx(self, model: PreTrainedModel, tokenizer: PreTrainedTokenizer):
		"""
		# Export PyTorch model to ONNX format for serving with ONNX Runtime Web
		"""
		if self.device != device('cpu'):
			model = model.to("cpu")
		pipeline = transformers.pipeline("text-classification",model=model,tokenizer=tokenizer)
		onnx_convert.convert_pytorch(pipeline, opset=11, output=Path("classifier.onnx"), use_external_format=False)
     
	def compute_metrics(self, eval_pred: EvalPrediction):
		"""
		Compute metrics and return metrics
		"""
		logits, labels = eval_pred
		return self.metrics.compute(predictions=np.argmax(logits, axis=-1), references=labels)
	
	def test_metrics(self, predictions, predictions_int8):
		"""
		print metrics of pytorch and onnx model
		"""
		print(self.metrics.compute(predictions=predictions, references=test_dataset['label']))
		print(self.metrics.compute(predictions=predictions_int8, references=test_dataset['label']))

	def evaluate_onnx(self):
		quantize_dynamic("classifier.onnx", "classifier_int8.onnx", weight_type=QuantType.QUInt8)
		session = ort.InferenceSession("classifier.onnx")
		session_int8 = ort.InferenceSession("classifier_int8.onnx")
		input_feed = {
			"input_ids": np.array(test_dataset['input_ids']),
			"attention_mask": np.array(test_dataset['attention_mask']),
			"token_type_ids": np.array(test_dataset['token_type_ids'])
		}
		out = session.run(input_feed=input_feed,output_names=['output_0'])[0]
		out_int8 = session_int8.run(input_feed=input_feed,output_names=['output_0'])[0]
		predictions = np.argmax(out, axis=-1)
		predictions_int8 = np.argmax(out_int8, axis=-1)
		print("PyTorch Predictions Analysis")
		self.test_metrics(predictions, predictions_int8)


if __name__ == "__main__":
	print("current device: ", DEVICE)
	print("model name: ", MODEL_NAME)
	print("max length: ", MAX_LENGTH)
	print("onnx model path: ", ONNX_MODEL_PATH)

	train_emotion = TrainEmotion(MODEL_NAME, MAX_LENGTH, DEVICE, ONNX_MODEL_PATH)
	train_dataset, test_dataset = train_emotion.load_dataset()
	train_emotion.load_model(),
	train_emotion.train(
					train_dataset,
					test_dataset)
	train_emotion.export_onnx(train_emotion.model, train_emotion.tokenizer)
	train_emotion.evaluate_onnx()

	