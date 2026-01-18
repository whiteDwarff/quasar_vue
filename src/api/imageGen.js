export function useImageGen() {
  const form = reactive({
    size: 512,
    quality: 'lower',
    prompt: '',
  });

  const images = ref([]);
  const selection = ref(null);

  const generateImage = async () => {
    try {
      const res = await axiosLoading.post('/imageGen/imageFromPrompt', form);
      if (res.data.status == 200) {
        console.log(res.data.result);
        images.value.unshift(res.data.result);
        // form.images.push()
      }
    } catch (err) {
      console.error(err);
      $showAlert('이미지 생성 실패하였습니다.');
    }
  };

  const resetForm = () => {
    form.size = 512;
    form.quality = 'lower';
    form.prompt = '';
    form.images = [];
  }

  return {
    form,
    generateImage,
    resetForm,
    images,
    selection
  }
}