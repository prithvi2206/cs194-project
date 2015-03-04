//
//  JobCollectionViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse
import Foundation

class JobCollectionViewCell: UICollectionViewCell
{
    @IBOutlet weak var jobIconImageView: UIImageView!
    @IBOutlet weak var companyLabel: UILabel!
    
    var data: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    private func updateUI() {
        companyLabel?.text = nil
        jobIconImageView?.image = nil
        
        if data != nil {
            if let image = UIImage(named: "job.jpg") {
                jobIconImageView?.image = image
            }
            if let company = data!.objectForKey("company") as? String {
                companyLabel?.text = company
            }
        }
    }
    
}
