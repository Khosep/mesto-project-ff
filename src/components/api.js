 const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-27',
    headers: {
            authorization: '0b39d45b-dd06-4793-8ff9-ef89b584fc4d',
            'Content-Type': 'application/json',
        },
 };

// Делает универсальный HTTP запрос. Используется в функциях ниже.
async function makeRequest({ url, method = 'GET', headers = config.headers, body = null }) {
    const options = {method, headers};
    // if (body) {options.body = JSON.stringify(body);}
    body && (options.body = JSON.stringify(body));
    try {
        const response = await fetch(url, options);
        // response.ok: 200-299
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Получает массив данных карточек (по GET запросу)
const getCardsData = async () => {
    const endpoint = 'cards';
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url});
        return response;
    } catch (error) {
        console.error('Error getCardData:', error);
        throw error;
    }
}

// Получает объект с данными пользователя (по GET запросу)
const getProfileData = async () => {
    const endpoint = 'users/me';
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url});
        return response;
    } catch (error) {
        console.error('Error getProfileData:', error);
        throw error;
    }
}

// Получает данные по карточкам и пользователю в асинхронном режиме
const getAllDataAPI = async () => {
    try {
        const promise = await Promise.all([getCardsData(), getProfileData()]);
        return promise;
    } catch (error) {
        console.error('Error getAllDataAPI:', error);
    }
};

// Изменяет данные профиля - name и about - на сервере
const editProfileDataAPI = async (data) => {
    const endpoint = 'users/me';
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url, method: 'PATCH', body: data});
        return response;
    } catch (error) {
        console.error('Error editProfileDataAPI:', error);
        throw error;
    }
}

// Изменяет данные аватара на сервере
const editAvatarAPI = async (data) => {
    const endpoint = 'users/me/avatar';
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url, method: 'PATCH', body: data});
        return response;
    } catch (error) {
        console.error('Error editAvatarAPI:', error);
        throw error;
    }
}

// Создает новую карточку на сервере (отправляя name и link)
const createCardAPI = async (data) => {
    const endpoint = 'cards';
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url, method: 'POST', body: data});
        return response;
    } catch (error) {
        console.error('Error createCardAPI:', error);
        throw error;
    }
}

// Удаляет с сервера карточку по ее id
const deleteCardAPI = async (cardID) => {
    const endpoint = `cards/${cardID}`;
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url, method: 'DELETE'});
        return response;
    } catch (error) {
        console.error('Error deleteCardAPI:', error);
        throw error;
    }
}

// Добавляет like карточки на сервер
const addLikeAPI = async (cardID) => {
    const endpoint = `cards/likes/${cardID}`;
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url, method: 'PUT'});
        return response;
    } catch (error) {
        console.error('Error addLikeAPI:', error);
        throw error;
    }
}

// Удаляет like карточки с сервера
const deleteLikeAPI = async (cardID) => {
    const endpoint = `cards/likes/${cardID}`;
    const url = `${config.baseUrl}/${endpoint}`;
    try {
        const response = await makeRequest({url, method: 'DELETE'});
        return response;
    } catch (error) {
        console.error('Error deleteLikeAPI:', error);
        throw error;
    }
}

export {getAllDataAPI, editProfileDataAPI, createCardAPI, deleteCardAPI, addLikeAPI, deleteLikeAPI, editAvatarAPI};
