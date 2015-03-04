//
//  DocumentCollectionViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class DocumentCollectionViewCell: UICollectionViewCell {
    
    @IBOutlet weak var documentImageView: UIImageView!
    @IBOutlet weak var documentNameLabel: UILabel!
    
    var data: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    private func updateUI() {
        documentNameLabel?.text = nil
        documentImageView?.image = nil
        
        if data != nil {
            if let image = UIImage(named: "pdf-icon.png") {
                documentImageView?.image = image
            }
            if let name = data!.objectForKey("name") as? String {
                documentNameLabel?.text = name
            }
            if let version = data!.objectForKey("version") as? String {
                documentNameLabel?.text = documentNameLabel.text! + " (ver. \(version))"
            }
        }
    }
}
