import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

const refs = {
    formEl: document.querySelector('.search-form'),
    buttonEl: document.querySelector('[type="submit"]'),
}

refs.formEl.addEventListener('submit', handleFormSubmit)

function handleFormSubmit(e) {
    e.preventDefault();

    const formValue = e.target.elements.searchQuery.value;
}