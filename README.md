<div align="center">
   <div id="badges"> 🚧 Under development </h4>
</div>

# first-onnx
A basic implementation of ONNX using the microsoft/xtremedistil-l6-h256-uncased model.

## Overview

This repository contains a simple implementation of ONNX (Open Neural Network Exchange) using the `microsoft/xtremedistil-l6-h256-uncased` model. The ONNX model is located in the `onnx/model.py` file, and we've also provided the exported classifier model in both `onnx/classifier.onnx` and `onnx/classifier_int8.onnx` formats.

## Getting Started
To get started with this project, follow the instructions below:

```bash
# install dependencies for running the model
pip install -r requirements.txt
pip install accelerate -U
# run the model
python onnx/model.py
```

app made with vite react 

```bash
# install dependencies for running the app
cd app
npm install
# run the app
npm run dev
```


## Model Information
- Model Used: `microsoft/xtremedistil-l6-h256-uncased`
- ONNX Model Location: `onnx/model.py`
- Exported Classifier Models: `onnx/classifier.onnx` and `onnx/classifier_int8.onnx`
- Colab Notebook: [notebook](https://colab.research.google.com/drive/1XSZRQf1T1ZZcJEEo4ofNtS4g8BNadjbR?usp=sharing)


## Contributing
Feel free to contribute to this project by opening issues or submitting pull requests. We welcome any enhancements, bug fixes, or new features that can improve this basic ONNX implementation.
