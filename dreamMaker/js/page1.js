//logo动画
//为了延时出现各个动画，采用定时器
setTimeout(function() {
	$('.logo').addClass('logo2');
	setTimeout(function() {
		$('.pd').addClass('pd2');
		setTimeout(function() {
			$('.pr').addClass('pr2');
			setTimeout(function() {
				$('.pe').addClass('pe2');
				setTimeout(function() {
					$('.pm').addClass('pm2');
					setTimeout(function() {
						$('.word').addClass('word2');
						setTimeout(function() {
							$('.page1Title').addClass('zoomIn animated');
							$('.page1Title').show();
							setTimeout(function() {
								$('.blueStar').addClass('blueStar2');
								$('.pinkStar').addClass('pinkStar2');
							})
						}, 1000)
					}, 1000)
				}, 300)
			}, 300)
		}, 300)
	}, 1000)
}, 1000)